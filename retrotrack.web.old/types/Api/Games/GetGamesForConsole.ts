import { Game } from "./PublicGame";

export interface GamesForConsole {
    consoleName: string;
    consoleId:   number;
    games:       Game[];
}