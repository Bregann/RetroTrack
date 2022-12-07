export interface GetGameInfoForUser {
    gameId:           number;
    title:            string;
    consoleId:        number;
    imageInGame:      string;
    imageBoxArt:      string;
    genre:            string;
    consoleName:      string;
    achievementCount: number;
    players:          number;
    achievements:     Achievement[];
    numAwardedToUser: number;
    userCompletion:   string;
}

export interface Achievement {
    id:                 number;
    title:              string;
    description:        string;
    points:             number;
    badgeName:          string;
    numAwarded:         number;
    numAwardedHardcore: number;
    dateEarned:         null | string;
}