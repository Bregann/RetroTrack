namespace RetroTrack.Domain.DTOs.Controllers.Auth
{
    public class RegisterUserDto
    {
        public required bool Success { get; set; }
        public string? Reason { get; set; }
    }
}
