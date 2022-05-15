using RetroAchievementTracker.Data.TrackedGames;
using RetroAchievementTracker.RetroAchievementsAPI;

namespace RetroAchievementTracker.Data.GameData
{
    public class GameDataService
    {
        public async Task<GameData> GetGameDataToPopulateModal(int gameId)
        {
            var data = await RetroAchievements.GetSpecificGameInfo(gameId);

            if (data == null)
            {
                return null;
            }

            var gameModal = new GameData
            {
                AchievementCount = data.AchievementCount,
                ConsoleName = data.ConsoleName,
                Genre = data.Genre,
                Id = data.Id,
                PlayersCasual = data.PlayersCasual,
                PlayersHardcore = data.PlayersHardcore,
                Title = data.Title,
                ImageBoxArt = "https://s3-eu-west-1.amazonaws.com/i.retroachievements.org" + data.ImageBoxArt,
                ImageIcon = "https://s3-eu-west-1.amazonaws.com/i.retroachievements.org" + data.ImageIcon,
                ImageIngame = "https://s3-eu-west-1.amazonaws.com/i.retroachievements.org" + data.ImageIngame,
                Achievements = new Dictionary<string, Achievement>(),
                RAURL = "https://retroachievements.org/game/" + data.Id.ToString()
            };

            foreach (var achievement in data.Achievements)
            {
                var achievementBadgeName = "";
                var chars = achievement.Value.BadgeName.ToString().ToCharArray();

                if (chars[0] == '1' && chars.Length <= 4)
                {
                    achievementBadgeName = "0" + achievement.Value.BadgeName.ToString();
                }
                else
                {
                    achievementBadgeName = achievement.Value.BadgeName.ToString();
                }

                gameModal.Achievements.Add(achievement.Key, new Achievement
                {
                    NumAwarded = achievement.Value.NumAwarded,
                    NumAwardedHardcore = achievement.Value.NumAwardedHardcore,
                    Title = achievement.Value.Title,
                    Description = achievement.Value.Description,
                    Points = achievement.Value.Points,
                    BadgeUrl = "https://s3-eu-west-1.amazonaws.com/i.retroachievements.org/Badge/" + achievementBadgeName + "_lock.png"
                });
            }

            return gameModal;
        }

        public async Task<GameData> GetLoggedInDataToPopulateModal(int gameId, string username)
        {
            var data = await RetroAchievements.GetSpecificGameInfoAndUserProgress(gameId, username);

            if (data == null)
            {
                return null;
            }

            var gameModal = new GameData
            {
                AchievementCount = data.AchievementCount,
                AchievementsUnlocked = data.NumAwardedToUser,
                ConsoleName = data.ConsoleName,
                Genre = data.Genre,
                Id = data.Id,
                PlayersCasual = data.PlayersCasual,
                PlayersHardcore = data.PlayersHardcore,
                PercentageCompleted = data.UserCompletion,
                Title = data.Title,
                ImageBoxArt = "https://s3-eu-west-1.amazonaws.com/i.retroachievements.org" + data.ImageBoxArt,
                ImageIcon = "https://s3-eu-west-1.amazonaws.com/i.retroachievements.org" + data.ImageIcon,
                ImageIngame = "https://s3-eu-west-1.amazonaws.com/i.retroachievements.org" + data.ImageIngame,
                Achievements = new Dictionary<string, Achievement>(),
                RAURL = "https://retroachievements.org/game/" + data.Id.ToString(),
                GameTracked = TrackedGamesService.IsGameTracked(gameId, username),
                LoggedInUser = username
            };

            foreach (var achievement in data.Achievements.OrderByDescending(x => x.Value.DateEarned))
            {
                var achievementState = "";
                var achievementBadgeName = "";

                var chars = achievement.Value.BadgeName.ToString().ToCharArray();

                if (chars[0] == '1' && chars.Length <= 4)
                {
                    achievementBadgeName = "0" + achievement.Value.BadgeName.ToString();
                }
                else
                {
                    achievementBadgeName = achievement.Value.BadgeName.ToString();
                }


                if (achievement.Value.DateEarned != null || achievement.Value.DateEarnedHardcore != null)
                {
                    achievementState = ".png";
                }
                else
                {
                    achievementState = "_lock.png";
                }

                gameModal.Achievements.Add(achievement.Key, new Achievement
                {
                    NumAwarded = achievement.Value.NumAwarded,
                    NumAwardedHardcore = achievement.Value.NumAwardedHardcore,
                    DateEarned = achievement.Value.DateEarned,
                    DateEarnedHardcore = achievement.Value.DateEarnedHardcore,
                    Title = achievement.Value.Title,
                    Description = achievement.Value.Description,
                    Points = achievement.Value.Points,
                    BadgeUrl = "https://s3-eu-west-1.amazonaws.com/i.retroachievements.org/Badge/" + achievementBadgeName + achievementState
                });
            }

            return gameModal;
        }
    }
}
