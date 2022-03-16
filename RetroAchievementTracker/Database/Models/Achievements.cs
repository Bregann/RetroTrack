using System.ComponentModel.DataAnnotations;

namespace RetroAchievementTracker.Database.Models
{
    public class Achievements
    {
        [Key]
        public string NameAndGameId { get; set; }
        public string Username { get; set; }
        public int GameId { get; set; }
        public int NumPossibleAchievements { get; set; }
        public int PossibleScore { get; set; }
        public int NumAchievedHardcore { get; set; }
        public int ScoreAchievedHardcore { get; set; }
    }
}
