export interface GetPlaylistResponse {
  playlists: PlaylistItem[]
}

export interface PlaylistItem {
  id: string
  name: string
  description: string
  numberOfLikes: number
  numberOfGames: number
  createdAt: string
  updatedAt: string
  createdBy: string
  icons: string[]
  isPublic: boolean
}
