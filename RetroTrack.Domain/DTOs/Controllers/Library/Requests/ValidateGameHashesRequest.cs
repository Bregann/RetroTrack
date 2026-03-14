namespace RetroTrack.Domain.DTOs.Controllers.Library.Requests
{
    public class ValidateGameHashesRequest
    {
        public required string[] Hashes { get; set; }
    }
}
