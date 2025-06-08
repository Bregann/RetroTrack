namespace RetroTrack.Domain.DTOs.Controllers.Auth
{
    public class ResetUserPasswordDto
    {
        public required bool Success { get; set; }
        public string? Reason { get; set; }
    }
}
