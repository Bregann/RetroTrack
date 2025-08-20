namespace RetroTrack.Domain.Exceptions
{
    public class RetroAchievementsApiException : Exception
    {
        public RetroAchievementsApiException(string message)
            : base(message) { }

        public RetroAchievementsApiException(string message, Exception inner)
            : base(message, inner) { }
    }
}