using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RetroTrack.Domain.Database.Models
{
    public class UserPlaylistLikes
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public required string UserPlaylistId { get; set; }
        [ForeignKey("UserPlaylistId")]
        public virtual UserPlaylist UserPlaylist { get; set; } = null!;

        public required int UserId { get; set; }
        [ForeignKey("UserId")]
        public virtual User User { get; set; } = null!;
    }
}
