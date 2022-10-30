using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RetroTrack.Api.Database.Models
{
    public class Users
    {
        [Key]
        public string Username { get; set; }
        public string HashedApiKey { get; set; }
        public string HashedPassword { get; set; }
        public List<UserGameProgress> UserGameProgress { get; set; }
        public List<TrackedGames> TrackedGames { get; set; }
    }
}
