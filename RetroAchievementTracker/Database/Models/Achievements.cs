using System.ComponentModel.DataAnnotations;

namespace RetroAchievementTracker.Database.Models
{
    public class Achievements
    {
        [Key]
        public int Id { get; set; }
        public int GameId { get; set; }
        public int NumberAwardedCasual { get; set; }
        public int NumberAwardedHardcore { get; set; }
        public string AchievementTitle { get; set; }
        public string AchievementDescription { get; set; }
        public int PointsValue { get; set; }
    }
}
