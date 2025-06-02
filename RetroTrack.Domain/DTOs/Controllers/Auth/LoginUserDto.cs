namespace RetroTrack.Domain.DTOs.Controllers.Auth
{
    public class LoginUserDto
    {
        public required bool Successful { get; set; }
        public string SessionId { get; set; } = "";
        public string Username { get; set; } = "";
    }
}
