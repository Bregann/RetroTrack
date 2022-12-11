import { Achievement } from "./UserAchievement";

export interface UserAchievementsForGame {
    success?:      boolean;
    reason?:       string;
    achievements?: Achievement[];
}