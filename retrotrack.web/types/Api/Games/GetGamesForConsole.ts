export interface GamesForConsole {
    consoleName: string;
    consoleId:   number;
    games:       Game[];
}

export interface Game {
    gameId:           number;
    gameIconUrl:      string;
    gameName:         string;
    achievementCount: number;
    gameGenre:        string;
}
