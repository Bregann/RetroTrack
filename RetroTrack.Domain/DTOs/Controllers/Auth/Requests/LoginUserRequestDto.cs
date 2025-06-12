namespace RetroTrack.Domain.DTOs.Controllers.Auth.Requests
{
    public class LoginUserRequestDto
    {
        public required string Username { get; set; }
        public required string Password { get; set; }
    }
}