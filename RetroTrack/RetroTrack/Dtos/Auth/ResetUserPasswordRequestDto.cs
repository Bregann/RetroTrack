namespace RetroTrack.Api.Dtos.Auth
{
    public class ResetUserPasswordRequestDto
    {
        public required string RaUsername { get; set; }
        public required string Password { get; set; }
        public required string ApiKey { get; set; }
    }
}