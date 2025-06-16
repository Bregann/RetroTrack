'use client'
import { useState, useMemo } from 'react'
import { Container, Paper } from '@mantine/core'
import PaginatedTable, { Column, SortOption } from '../shared/PaginatedTable'
import { PublicGameTableColumns } from '@/interfaces/Pages/PublicGameTableColumns'
import Image from 'next/image'
import styles from '@/css/components/publicGamesTable.module.scss'
import { usePublicPaginatedTableQuery } from '@/hooks/Consoles/usePublicPaginatedTableQuery'
import type { Game, GetGamesForConsoleResponse } from '@/interfaces/Api/Games/GetGamesForConsoleResponse'

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
  const [page, setPage] = useState(1)
  const [sortOption, setSortOption] = useState<SortOption<Game>>({
    key: 'gameTitle',
    direction: 'asc',
  })

  const queryString = useMemo(() => {
    const skip = (page - 1) * 100
    const take = 100
    const sortKeyMap: Record<string,string> = {
      gameTitle: 'SortByName',
      gameGenre: 'SortByGenre',
      achievementCount: 'SortByAchievementCount',
      playerCount: 'SortByPlayerCount'
    }
    const sortParam = sortKeyMap[sortOption.key] || 'SortByName'
    const sortValue = sortOption.direction === 'asc'
    return `ConsoleId=-1&Skip=${skip}&Take=${take}&${sortParam}=${sortValue}`
  }, [page, sortOption])

  const isFirstLoad = queryString === 'ConsoleId=-1&Skip=0&Take=100&SortByName=true'


  const { data, isLoading, isError, error } = usePublicPaginatedTableQuery(
    queryString,
    isFirstLoad ? props.pageData : undefined
  )

  const totalPages = data?.totalPages ?? 0

  if (isLoading) return <p>Loading page {page}… ⏳</p>
  if (isError) return <p>Oops: {error.message}</p>

  return (
    <Container size="95%">
      <h1>All Games</h1>
      <Paper className={styles.paper}>
        <PaginatedTable
          data={data?.games ?? []}
          columns={columns}
          page={page}
          total={totalPages}
          sortOption={sortOption}
          onSortChange={(option) => {
            setPage(1) // reset to first page on sort
            setSortOption(option)
          }}
          onPageChange={(newPage) => {
            setPage(newPage)
          }}
        />
      </Paper>

    </Container>
  )
}
