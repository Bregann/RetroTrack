import { Game } from "./LoggedInGame";

export interface GamesAndUserProgressForConsole {
    consoleName: string;
    consoleId:   number;
    games:       Game[];
}