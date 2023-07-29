using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RetroTrack.Infrastructure.Database.Models
{
    public class UndevvedGames
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.None)]
        public required int Id { get; set; }

        [Required]
        public required string Title { get; set; }

        [Required]
        public required GameConsoles GameConsole { get; set; }

        public string? Developer { get; set; } = null;
    }
}
