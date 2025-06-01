namespace RetroTrack.Domain.OldCode.Dtos
{
    public class LoginUserDto
    {
        public required bool Successful { get; set; }
        public string SessionId { get; set; } = "";
        public string Username { get; set; }
    }

    public class RegisterUserDto
    {
        public required bool Success { get; set; }
        public string? Reason { get; set; }
    }

    public class ResetUserPasswordDto
    {
        public required bool Success { get; set; }
        public string? Reason { get; set; }
    }
}