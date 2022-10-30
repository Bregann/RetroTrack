using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace RetroTrack.Api.Database.Models
{
    public class UserGameProgress
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [ForeignKey("username")]
        [Column("username")]
        public string Username { get; set; }

        public int GameID { get; set; }
        public int ConsoleID { get; set; }
        public int AchievementsGained { get; set; }
        public string GameName { get; set; }
        public bool HardcoreMode { get; set; }
        public double GamePercentage { get; set; }
    }
}
