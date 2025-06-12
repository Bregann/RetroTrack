namespace RetroTrack.Domain.DTOs.Controllers.Auth
{
    public class LoginUserDto
    {
        public required string AccessToken { get; set; }
        public required string RefreshToken { get; set; }
    }
}
