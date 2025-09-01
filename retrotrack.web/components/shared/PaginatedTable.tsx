'use client'

import React, { ReactNode } from 'react'
import { Table, Pagination, Button, Group, Select } from '@mantine/core'
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
  pageSize?: number
  onPageSizeChange?: (pageSize: number) => void
  pageSizeOptions?: number[]
  showPageSizeSelector?: boolean
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
  renderActions,
  pageSize = 100,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 25, 50, 100],
  showPageSizeSelector = false
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
        <Table.Td style={{ whiteSpace: 'nowrap' }}>
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
      <div style={{ overflowX: 'auto' }}>
        <Table striped highlightOnHover style={styles}>
          <Table.Thead>
            <Table.Tr>
              {columns.filter(x => x.show !== false).map((col, colIndex) => {
                const isSorted = col.key === currentKey
                const canSort = Boolean(col.sortable !== undefined && onSortChange)

                return (
                  <Table.Th
                    key={colIndex}
                    style={{
                      cursor: canSort ? 'pointer' : undefined,
                      whiteSpace: 'nowrap'
                    }}
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
                <Table.Th style={{ whiteSpace: 'nowrap' }}>{actionsTitle}</Table.Th>
              )}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </div>
      <Group justify="space-between" align="center" style={{ marginTop: '1rem' }}>
        {showPageSizeSelector && onPageSizeChange !== undefined && (
          <Group gap="xs" align="center">
            <span>Show:</span>
            <Select
              value={pageSize.toString()}
              onChange={(value) => {
                if (value !== null) {
                  onPageSizeChange(parseInt(value))
                }
              }}
              data={pageSizeOptions.map(option => ({
                value: option.toString(),
                label: option.toString()
              }))}
              style={{ width: 80 }}
              allowDeselect={false}
            />
            <span>per page</span>
          </Group>
        )}
        <Pagination
          value={page}
          total={total}
          onChange={onPageChange}
          style={{
            marginLeft: showPageSizeSelector ? 'auto' : '0',
            marginRight: showPageSizeSelector ? 'auto' : '0'
          }}
        />
        {showPageSizeSelector && (
          <div style={{ width: '120px' }} /> /* Spacer to keep pagination centered */
        )}
      </Group>
    </>
  )
}

export default PaginatedTable
