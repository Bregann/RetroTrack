using Microsoft.EntityFrameworkCore;
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
        public virtual User UserOwner { get; set; } = null!;

        public string? Description { get; set; }

        [Required]
        public required DateTime CreatedAt { get; set; }

        [Required]
        public required DateTime UpdatedAt { get; set; }

        [DeleteBehavior(DeleteBehavior.Cascade)]
        public virtual ICollection<UserPlaylistGame> PlaylistGames { get; set; } = null!;

        [DeleteBehavior(DeleteBehavior.Cascade)]
        public virtual ICollection<UserPlaylistLikes> PlaylistLikes { get; set; } = null!;
    }
}
