export interface GetRecentlyAddedAndUpdatedGamesResponse {
  days: Day[]
}

export interface Day {
  date: string
  newSets: Set[]
  updatedSets: Set[]
}

export interface Set {
  gameId: number
  title: string
  gameIcon: string
  consoleName: string
  consoleType: number
  achievementCount: string
  points: string
}
