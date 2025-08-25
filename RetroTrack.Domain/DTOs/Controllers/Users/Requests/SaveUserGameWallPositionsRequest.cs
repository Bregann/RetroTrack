namespace RetroTrack.Domain.DTOs.Controllers.Users.Requests
{
    public class SaveUserGameWallPositionsRequest
    {
        public required WallData[] WallData { get; set; }
    }

    public class WallData
    {
        public required int ProgressId { get; set; }
        public required int WallPosition { get; set; }
    }
}
