'use client'

import React, { ReactNode } from 'react'
import { Table, Pagination } from '@mantine/core'
import { IconArrowDown, IconArrowUp, IconLineDashed } from '@tabler/icons-react'

export interface Column<T> {
  title: string
  key?: keyof T
  render?: (item: T, index: number) => ReactNode
  sortable?: boolean
  show?: boolean
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
  styles
}: PaginatedTableProps<T>) {
  const currentKey = sortOption?.key
  const currentDir = sortOption?.direction || 'asc'

  const handleHeaderClick = (colKey?: keyof T) => {
    if (!colKey || !onSortChange) return
    // toggle direction if same key, else default to asc
    const direction: SortDirection =
      currentKey === colKey && currentDir === 'asc' ? 'desc' : 'asc'
    onSortChange({ key: colKey, direction })
  }

  const rows = data.map((item, index) => (
    <Table.Tr key={index} onClick={() => onRowClick && onRowClick(item, index)} style={{ cursor: onRowClick ? 'pointer' : 'default' }}>
      {columns.filter(x => x.show !== false).map((col, colIndex) => (
        <Table.Td key={colIndex}>
          {col.render
            ? col.render(item, index)
            : String(item[col.key!] as ReactNode)}
        </Table.Td>
      ))}
    </Table.Tr>
  ))

  return (
    <>
      <Table striped highlightOnHover style={styles}>
        <Table.Thead>
          <Table.Tr>
            {columns.filter(x => x.show !== false).map((col, colIndex) => {
              const isSorted = col.key === currentKey
              const canSort = Boolean(col.sortable && onSortChange)

              return (
                <Table.Th
                  key={colIndex}
                  style={{ cursor: canSort ? 'pointer' : undefined }}
                  onClick={() => canSort && handleHeaderClick(col.key)}
                >
                  {col.title}
                  {isSorted && (currentDir === 'asc' ? <IconArrowUp style={{ marginBottom: -5, marginLeft: 10 }}/> : <IconArrowDown style={{ marginBottom: -5, marginLeft: 10 }}/>)}
                  {canSort && !isSorted && (
                    <IconLineDashed style={{ marginBottom: -7, marginLeft: 10 }}/>
                  )}
                </Table.Th>
              )
            })}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
      <Pagination value={page} total={total} onChange={onPageChange} />
    </>
  )
}

export default PaginatedTable
