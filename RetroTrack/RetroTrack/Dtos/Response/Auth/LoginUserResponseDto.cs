namespace RetroTrack.Api.Dtos.Response.Auth
{
    public class LoginUserResponseDto
    {
        public required string Username { get; set; }
        public required string SessionId { get; set; }
    }
}
