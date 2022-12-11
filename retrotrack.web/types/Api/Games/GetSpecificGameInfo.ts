export interface GetSpecificGameInfo {
    gameId:           number;
    title:            string;
    consoleId:        number;
    consoleName:      string;
    imageInGame:      string;
    imageBoxArt:      string;
    genre:            string;
    achievementCount: number;
    players:          number;
    achievements:     Achievement[];
}

export interface Achievement {
    id:                 number;
    numAwarded:         number;
    numAwardedHardcore: number;
    title:              string;
    description:        string;
    points:             number;
    badgeName:          string;
}
