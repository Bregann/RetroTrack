'use client'

import React, { ReactNode } from 'react'
import { Table, Pagination, Button, Group, Select, Text } from '@mantine/core'
import { IconArrowDown, IconArrowUp, IconLineDashed, IconTableOff } from '@tabler/icons-react'
import tableStyles from '@/css/components/paginatedTable.module.scss'

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
    <Table.Tr
      key={index}
      onClick={() => onRowClick !== undefined && onRowClick(item, index)}
      className={`${tableStyles.bodyRow} ${onRowClick !== undefined ? tableStyles.clickable : ''}`}
    >
      {columns.filter(x => x.show !== false).map((col, colIndex) => (
        <Table.Td key={colIndex} className={tableStyles.bodyCell}>
          {col.render !== undefined
            ? col.render(item, index)
            : String(item[col.key!] as ReactNode)}
        </Table.Td>
      ))}
      {hasActions !== undefined && (
        <Table.Td className={`${tableStyles.bodyCell} ${tableStyles.actionsCell}`}>
          {renderActions !== undefined ? (
            renderActions(item, index)
          ) : (
            <div className={tableStyles.actionButtons}>
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
                  className={`${tableStyles.actionButton} ${tableStyles[action.variant ?? 'light']}`}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </Table.Td>
      )}
    </Table.Tr>
  ))

  return (
    <div className={tableStyles.paginatedTableContainer}>
      <div className={tableStyles.tableWrapper}>
        <Table className={tableStyles.modernTable} style={styles}>
          <Table.Thead className={tableStyles.tableHeader}>
            <Table.Tr>
              {columns.filter(x => x.show !== false).map((col, colIndex) => {
                const isSorted = col.key === currentKey
                const canSort = Boolean((col.sortable !== false) && onSortChange)

                return (
                  <Table.Th
                    key={colIndex}
                    className={`${tableStyles.headerCell} ${canSort ? tableStyles.sortableHeader : ''} ${isSorted ? tableStyles.sortedHeader : ''}`}
                    onClick={() => canSort && handleHeaderClick(col)}
                  >
                    <div className={tableStyles.headerContent}>
                      {col.title}
                      {isSorted && (
                        <div className={tableStyles.sortIcon}>
                          {currentDir === 'asc' ? <IconArrowUp /> : <IconArrowDown />}
                        </div>
                      )}
                      {canSort && !isSorted && (
                        <div className={tableStyles.sortIcon}>
                          <IconLineDashed />
                        </div>
                      )}
                    </div>
                  </Table.Th>
                )
              })}
              {hasActions !== undefined && (
                <Table.Th className={tableStyles.headerCell}>{actionsTitle}</Table.Th>
              )}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody className={tableStyles.tableBody}>{rows}</Table.Tbody>
        </Table>
      </div>
      <div className={tableStyles.paginationSection}>
        {showPageSizeSelector && onPageSizeChange !== undefined && (
          <div className={tableStyles.pageSizeSelector}>
            <span className={tableStyles.selectorLabel}>Show:</span>
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
              className={tableStyles.pageSizeSelect}
              allowDeselect={false}
            />
            <span className={tableStyles.selectorLabel}>per page</span>
          </div>
        )}
        <Pagination
          value={page}
          total={total}
          onChange={onPageChange}
          className={tableStyles.paginationControls}
        />
        {showPageSizeSelector && (
          <div className={tableStyles.paginationSpacer} />
        )}
      </div>
    </div>
  )
}

export default PaginatedTable
