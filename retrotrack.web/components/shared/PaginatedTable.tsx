'use client'

import React, { ReactNode } from 'react'
import { Table, Pagination, Button, Group } from '@mantine/core'
import { IconArrowDown, IconArrowUp, IconLineDashed } from '@tabler/icons-react'

export interface Column<T> {
  title: string
  key?: keyof T
  render?: (item: T, index: number) => ReactNode
  sortable?: boolean
  show?: boolean
  toggleDescFirst?: boolean // if true, will always sort desc first
}

export interface ActionButton<T> {
  label: string
  icon?: ReactNode
  onClick: (item: T, index: number) => void
  variant?: string
  color?: string
  disabled?: (item: T, index: number) => boolean
}

export type SortDirection = 'asc' | 'desc'
export interface SortOption<T> {
  key: keyof T
  direction: SortDirection
}

export interface PaginatedTableProps<T> {
  data: T[]
  columns: Column<T>[]
  page: number
  total: number
  onPageChange: (page: number) => void
  onSortChange?: (option: SortOption<T>) => void
  onRowClick?: (item: T, index: number) => void
  sortOption?: SortOption<T>
  styles?: React.CSSProperties
  actions?: ActionButton<T>[]
  actionsTitle?: string
  renderActions?: (item: T, index: number) => ReactNode
}

export function PaginatedTable<T>({
  data,
  columns,
  page,
  total,
  onPageChange,
  onSortChange,
  onRowClick,
  sortOption,
  styles,
  actions,
  actionsTitle = 'Actions',
  renderActions
}: PaginatedTableProps<T>) {
  const currentKey = sortOption?.key
  const currentDir = sortOption?.direction ?? 'asc'

  const hasActions = (actions !== undefined && actions.length > 0) || renderActions

  const handleHeaderClick = (column?: Column<T>) => {
    if (column?.key === undefined|| onSortChange === undefined) return

    const isSameColumn = currentKey === column.key
    let direction: SortDirection

    if (!isSameColumn) {
      // first-ever click on this column
      direction = column.toggleDescFirst === false ? 'desc' : 'asc'
    } else {
      // already sorted, so just flip it
      direction = currentDir === 'asc' ? 'desc' : 'asc'
    }

    onSortChange({ key: column.key, direction })
  }

  const rows = data.map((item, index) => (
    <Table.Tr key={index} onClick={() => onRowClick !== undefined && onRowClick(item, index)} style={{ cursor: onRowClick !== undefined ? 'pointer' : 'default' }}>
      {columns.filter(x => x.show !== false).map((col, colIndex) => (
        <Table.Td key={colIndex}>
          {col.render !== undefined
            ? col.render(item, index)
            : String(item[col.key!] as ReactNode)}
        </Table.Td>
      ))}
      {hasActions !== undefined && (
        <Table.Td>
          {renderActions !== undefined ? (
            renderActions(item, index)
          ) : (
            <Group gap="xs">
              {actions?.map((action, actionIndex) => (
                <Button
                  key={actionIndex}
                  size="xs"
                  variant={action.variant ?? 'light'}
                  color={action.color}
                  disabled={action.disabled !== undefined ? action.disabled(item, index) : false}
                  onClick={(e) => {
                    e.stopPropagation() // Prevent row click when clicking button
                    action.onClick(item, index)
                  }}
                  leftSection={action.icon}
                >
                  {action.label}
                </Button>
              ))}
            </Group>
          )}
        </Table.Td>
      )}
    </Table.Tr>
  ))

  return (
    <>
      <Table striped highlightOnHover style={styles}>
        <Table.Thead>
          <Table.Tr>
            {columns.filter(x => x.show !== false).map((col, colIndex) => {
              const isSorted = col.key === currentKey
              const canSort = Boolean(col.sortable !== undefined && onSortChange)

              return (
                <Table.Th
                  key={colIndex}
                  style={{ cursor: canSort ? 'pointer' : undefined }}
                  onClick={() => canSort && handleHeaderClick(col)}
                >
                  {col.title}
                  {isSorted && (currentDir === 'asc' ? <IconArrowUp style={{ marginBottom: -5, marginLeft: 10 }} /> : <IconArrowDown style={{ marginBottom: -5, marginLeft: 10 }} />)}
                  {canSort && !isSorted && (
                    <IconLineDashed style={{ marginBottom: -7, marginLeft: 10 }} />
                  )}
                </Table.Th>
              )
            })}
            {hasActions !== undefined && (
              <Table.Th>{actionsTitle}</Table.Th>
            )}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
      <Pagination value={page} total={total} onChange={onPageChange} />
    </>
  )
}

export default PaginatedTable
