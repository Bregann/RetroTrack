using System.ComponentModel.DataAnnotations;

namespace RetroAchievementTracker.Database.Models
{
    public class Games
    {
        [Key]
        public int Id { get; set; }
        public string Title { get; set; }
        public int ConsoleID { get; set; }
        public string imageIcon { get; set; }
        public DateTime DateAdded { get; set; }
        public string GameGenre { get; set; }
        public int ReleaseDate { get; set; }
        public int AchievementCount { get; set; }
        public int PlayersCasual { get; set; }
        public int PlayersHardcore { get; set; }
    }
}
