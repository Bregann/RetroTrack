using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RetroTrack.Domain.Database.Models
{
    public class UserPlaylistGame
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public required string UserPlaylistId { get; set; }
        [ForeignKey("UserPlaylistId")]
        public UserPlaylist UserPlaylist { get; set; } = null!;

        [Required]
        public required int OrderIndex { get; set; }

        public required int GameId { get; set; }
        [ForeignKey("GameId")]
        public Game Game { get; set; } = null!;
    }
}
