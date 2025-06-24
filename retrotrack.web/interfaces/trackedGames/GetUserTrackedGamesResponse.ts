import { LoggedInGame } from "../api/games/GetUserProgressForConsoleResponse"

export interface GetUserTrackedGamesResponse {
    totalCount: number
    totalPages: number
    games: LoggedInGame[]
}