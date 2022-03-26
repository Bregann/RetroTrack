using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RetroAchievementTracker.Database.Models
{
    public class TrackedGames
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.None)]
        public string UsernameGameID { get; set; }
        public int GameID { get; set; }
        public string Username { get; set; }
    }
}
