namespace RetroTrack.Dtos.Auth
{
    public class LoginUserRequestDto
    {
        public required string Username { get; set; }
        public required string Password { get; set; }
    }
}
