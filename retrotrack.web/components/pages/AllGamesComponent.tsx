'use client'

import { Game, GetGamesForConsoleResponse } from '@/interfaces/Api/Games/GetGamesForConsoleResponse'
import { Container, Paper } from '@mantine/core'
import { useState } from 'react'
import PaginatedTable, { Column, SortOption } from '../shared/PaginatedTable'
import { PublicGameTableColumns } from '@/interfaces/Pages/PublicGameTableColumns'
import Image from 'next/image'
import styles from '@/css/components/publicGamesTable.module.scss'

interface AllPagesComponentProps {
  pageData: GetGamesForConsoleResponse
}

const columns: Column<PublicGameTableColumns>[] = [
  {
    title: '',
    key: 'gameImageUrl',
    render: (item) => {
      return (
        <Image
          src={`https://media.retroachievements.org${item.gameImageUrl}`}
          alt={`${item.gameTitle} achievement icon`}
          width={64}
          height={64}
          className={styles.roundedImage}
        />
      )
    }
  },
  {
    title: 'Game Title',
    key: 'gameTitle',
    sortable: true
  },
  {
    title: 'Genre',
    key: 'gameGenre',
    sortable: true
  },
  {
    title: 'Achievements',
    key: 'achievementCount',
    sortable: true
  },
  {
    title: 'Players',
    key: 'playerCount',
    sortable: true
  }
]

export default function AllPagesComponent(props: AllPagesComponentProps) {
  const [pageData, setPageData] = useState<GetGamesForConsoleResponse>(props.pageData)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(pageData.totalPages)

  const [sortOption, setSortOption] = useState<SortOption<Game>>({
    key: 'gameTitle',
    direction: 'asc',
  })

  return (
    <Container size="95%">
      <h1>All Games</h1>
      <Paper className={styles.paper}>
        <PaginatedTable
          data={pageData.games}
          columns={columns}
          page={currentPage}
          total={totalPages}
          sortOption={sortOption}
          onSortChange={(option) => {
          // Here you would typically sort the data based on the selected option
          // For this example, we will just log the sort option
            setSortOption(option)
            console.log(`Sorting by ${option.key} in ${option.direction} order`)
          }}
          onPageChange={(page) => {
            setCurrentPage(page)
            // Here you would typically fetch new data based on the page number
            // For this example, we will just log the page number
            console.log(`Fetching data for page ${page}`)
          }}
        />
      </Paper>

    </Container>
  )
}
