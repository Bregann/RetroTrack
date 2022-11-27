using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace RetroTrack.Infrastructure.Database.Models
{
    public class UserGameProgress
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public required Users User { get; set; }
        public required int GameID { get; set; }
        public required int ConsoleID { get; set; }
        public required int AchievementsGained { get; set; }
        public required string GameName { get; set; }
        public required int HardcoreMode { get; set; }
        public required double GamePercentage { get; set; }
    }
}
