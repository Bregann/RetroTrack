using RetroTrack.Domain.DTOs.Controllers.Games;

namespace RetroTrack.Domain.OldCode.Dtos
{
    public class UserAchievementsForGameDto
    {
        public bool Success { get; set; }
        public string Reason { get; set; }
        public required List<UserAchievement>? Achievements { get; set; }
    }
}