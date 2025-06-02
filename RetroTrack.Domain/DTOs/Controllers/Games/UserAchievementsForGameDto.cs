namespace RetroTrack.Domain.DTOs.Controllers.Games
{
    public class UserAchievementsForGameDto
    {
        public bool Success { get; set; }
        public string Reason { get; set; }
        public required List<UserAchievement>? Achievements { get; set; }
    }
}