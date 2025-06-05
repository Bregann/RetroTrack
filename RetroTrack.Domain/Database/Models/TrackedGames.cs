using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RetroTrack.Domain.Database.Models
{
    public class TrackedGames
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [ForeignKey(nameof(GameId))]
        public required int GameId { get; set; }
        public virtual Games Game { get; set; } = null!;

        [ForeignKey(nameof(UserId))]
        public required int UserId { get; set; }
        public virtual Users User { get; set; } = null!;
    }
}