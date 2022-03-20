using System.ComponentModel.DataAnnotations;

namespace RetroAchievementTracker.Database.Models
{
    public class UserData
    {
        [Key]
        public string Username { get; set; }
        public string HashedApiKey { get; set; }
        public string LoginToken { get; set; }
    }
}
