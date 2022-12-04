export interface RecentGameUpdatesDayList {
    gamesTable?: GamesTable[];
    date:       string;
}

export interface GamesTable {
    gameId:           number;
    gameIconUrl:      string;
    gameName:         string;
    achievementCount: number;
    gameGenre:        string;
    console:          string;
}