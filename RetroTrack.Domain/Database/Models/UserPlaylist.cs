using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RetroTrack.Domain.Database.Models
{
    public class UserPlaylist
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; } = null!;

        [Required]
        public required string PlaylistName { get; set; }

        [Required]
        public required bool IsPublic { get; set; }

        [Required]
        public required int UserIdOwner { get; set; }
        [ForeignKey("UserIdOwner")]
        public User UserOwner { get; set; } = null!;

        public string? Description { get; set; }

        public string? GameImageIcon1 { get; set; }
        public string? GameImageIcon2 { get; set; }
        public string? GameImageIcon3 { get; set; }
        public string? GameImageIcon4 { get; set; }

        [Required]
        public required DateTime CreatedAt { get; set; }

        [Required]
        public required DateTime UpdatedAt { get; set; }

        public virtual ICollection<UserPlaylistGame> PlaylistGames { get; set; } = null!;
        public virtual ICollection<UserPlaylistLikes> PlaylistLikes { get; set; } = null!;
    }
}
