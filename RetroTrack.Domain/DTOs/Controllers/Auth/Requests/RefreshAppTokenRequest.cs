namespace RetroTrack.Domain.DTOs.Controllers.Auth.Requests
{
    public class RefreshAppTokenRequest
    {
        public required string RefreshToken { get; set; }
    }
}
