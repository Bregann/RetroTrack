'use client'

import React, { ReactNode } from 'react'
import { Table, Pagination } from '@mantine/core'

// Column definition: title shown in header; render for custom cell; key for default cell accessor
export interface Column<T> {
  title: string
  key?: keyof T
  render?: (item: T, index: number) => ReactNode
}

export interface PaginatedTableProps<T> {
  data: T[]
  columns: Column<T>[]
  RowComponent?: React.ComponentType<{ item: T; index: number }>
  page: number
  total: number
  onPageChange: (page: number) => void
}

export function PaginatedTable<T>({
  data,
  columns,
  RowComponent,
  page,
  total,
  onPageChange,
}: PaginatedTableProps<T>) {
  const rows = data.map((item, index) => {
    if (RowComponent) {
      return <RowComponent key={index} item={item} index={index} />
    }
    return (
      <Table.Tr key={index}>
        {columns.map((col, colIndex) => (
          <Table.Td key={colIndex}>
            {col.render
              ? col.render(item, index)
              : String(item[col.key!] as ReactNode)}
          </Table.Td>
        ))}
      </Table.Tr>
    )
  })

  return (
    <>
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            {columns.map((col, colIndex) => (
              <Table.Th key={colIndex}>{col.title}</Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
      <Pagination value={page} total={total} onChange={(number) => { onPageChange(number) }} />
    </>
  )
}

export default PaginatedTable
