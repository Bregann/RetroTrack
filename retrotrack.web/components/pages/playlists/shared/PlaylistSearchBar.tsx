'use client'

import { ActionIcon, Button, Group, Select, TextInput } from '@mantine/core'
import { IconList, IconPlus, IconSearch, IconTrash, IconX } from '@tabler/icons-react'
import playlistStyles from '@/css/pages/playlists.module.scss'

interface PlaylistSearchBarProps {
  searchInput: string
  onSearchInputChange: (_value: string) => void
  searchType: string
  onSearchTypeChange: (_value: string) => void
  onSearch: (_term: string | null) => void
  /** Owner-only management actions; omit to render the search side alone */
  onAddGames?: () => void
  onManageOrder?: () => void
  onDeleteGames?: () => void
}

/** Search field, search-type selector and the playlist management actions. */
export function PlaylistSearchBar({
  searchInput,
  onSearchInputChange,
  searchType,
  onSearchTypeChange,
  onSearch,
  onAddGames,
  onManageOrder,
  onDeleteGames
}: PlaylistSearchBarProps) {
  const submitSearch = () => {
    const trimmed = searchInput.trim()
    onSearch(trimmed !== '' ? trimmed : null)
  }

  const showActions = onAddGames !== undefined
    || onManageOrder !== undefined
    || onDeleteGames !== undefined

  return (
    <Group mb="md" className={playlistStyles.searchContainer} justify="space-between">
      <Group style={{ flex: 1, maxWidth: 600 }} gap="xs">
        <TextInput
          placeholder="Search games..."
          leftSection={<IconSearch size={16} />}
          value={searchInput}
          onChange={(e) => {
            const value = e.currentTarget.value
            onSearchInputChange(value)
            // Clearing the box clears the applied search straight away
            if (value.trim() === '') {
              onSearch(null)
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && searchInput.trim() !== '') {
              submitSearch()
            }
          }}
          className={playlistStyles.searchInput}
          style={{ flex: 1, minWidth: 200 }}
          rightSection={
            searchInput !== '' ? (
              <ActionIcon
                size="sm"
                variant="subtle"
                onClick={() => {
                  onSearchInputChange('')
                  onSearch(null)
                }}
              >
                <IconX size={16} />
              </ActionIcon>
            ) : null
          }
        />
        <Select
          data={[
            { value: '0', label: 'Game Title' },
            { value: '1', label: 'Genre' }
          ]}
          value={searchType}
          onChange={(value) => onSearchTypeChange(value ?? '0')}
          style={{ minWidth: 120 }}
          clearable
        />
        <Button
          variant="filled"
          color="blue"
          leftSection={<IconSearch size={16} />}
          className={playlistStyles.searchButton}
          onClick={submitSearch}
          disabled={searchInput.trim() === ''}
        >
          Search
        </Button>
      </Group>

      {showActions && (
        <Group gap="xs">
          {onAddGames !== undefined && (
            <ActionIcon
              variant="light"
              color="blue"
              size="lg"
              title="Add games to playlist"
              onClick={onAddGames}
            >
              <IconPlus size={20} />
            </ActionIcon>
          )}
          {onManageOrder !== undefined && (
            <ActionIcon
              variant="light"
              color="green"
              size="lg"
              onClick={onManageOrder}
              title="Manage game order"
            >
              <IconList size={20} />
            </ActionIcon>
          )}
          {onDeleteGames !== undefined && (
            <ActionIcon
              variant="light"
              color="red"
              size="lg"
              onClick={onDeleteGames}
              title="Delete games from playlist"
            >
              <IconTrash size={20} />
            </ActionIcon>
          )}
        </Group>
      )}
    </Group>
  )
}
