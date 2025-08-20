namespace RetroTrack.Domain.DTOs.Controllers.Auth.Requests
{
    public class DeleteUserSessionRequest
    {
        public string RefreshToken { get; set; } = string.Empty;
    }
}