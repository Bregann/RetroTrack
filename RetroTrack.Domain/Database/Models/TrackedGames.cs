using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RetroTrack.Domain.Database.Models
{
    public class TrackedGames
    {
        [Key]
        public required string Id { get; set; }

        [ForeignKey(nameof(GameId))]
        public required int GameId { get; set; }
        public virtual Games Game { get; set; } = null!;

        [ForeignKey(nameof(Username))]
        public required string Username { get; set; }
        public virtual Users User { get; set; } = null!;
    }
}