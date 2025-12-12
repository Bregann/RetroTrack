export interface GetLeaderboardsFromGameIdResponse {
      totalLeaderboards: number
      leaderboards: LeaderboardDetails[]
    }

export interface LeaderboardDetails {
      leaderboardId: number
      rank: number
      title: string
      description: string
      author: string
      topUser: string
      topScore: string
    }
