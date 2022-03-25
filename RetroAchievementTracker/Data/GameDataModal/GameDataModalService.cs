using RetroAchievementTracker.RetroAchievementsAPI;

namespace RetroAchievementTracker.Data.GameDataModal
{
    public class GameDataModalService
    {
        public async Task<GameDataModal> GetGameDataToPopulateModal(int gameId)
        {
            var data = await RetroAchievements.GetSpecificGameInfo(gameId);

            var gameModal = new GameDataModal
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
                gameModal.Achievements.Add(achievement.Key, new Achievement
                {
                    NumAwarded = achievement.Value.NumAwarded,
                    NumAwardedHardcore = achievement.Value.NumAwardedHardcore,
                    Title = achievement.Value.Title,
                    Description = achievement.Value.Description,
                    Points = achievement.Value.Points,
                    BadgeUrl = "https://s3-eu-west-1.amazonaws.com/i.retroachievements.org/Badge/" + achievement.Value.BadgeName + "_lock.png"
                });
            }

            return gameModal;
        }


    }
}
