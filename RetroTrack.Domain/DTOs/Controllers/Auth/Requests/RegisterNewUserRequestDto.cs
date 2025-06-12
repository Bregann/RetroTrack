namespace RetroTrack.Domain.DTOs.Controllers.Auth.Requests
{
    public class RegisterNewUserRequestDto
    {
        public required string Username { get; set; }
        public required string Password { get; set; }
        public required string ApiKey { get; set; }
    }
}