namespace RetroTrack.Domain.DTOs.Controllers.Auth.Responses
{
    public class LoginUserResponseDto
    {
        public required string AccessToken { get; set; }
        public required string RefreshToken { get; set; }
    }
}