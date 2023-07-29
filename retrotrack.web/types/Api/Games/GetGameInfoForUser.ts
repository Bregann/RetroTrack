import { Achievement } from "./UserAchievement";

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
    gameTracked:      boolean;
    totalPoints:      number;
    pointsEarned:     number;
}