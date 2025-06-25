import { LoggedInGame } from "../games/GetUserProgressForConsoleResponse"

export interface GetUserTrackedGamesResponse {
    totalCount: number
    totalPages: number
    games: LoggedInGame[]
}