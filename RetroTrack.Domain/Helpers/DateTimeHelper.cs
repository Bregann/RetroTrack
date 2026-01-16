namespace RetroTrack.Domain.Helpers
{
    public static class DateTimeExtensions
    {
        public static string ToHumanizedString(this DateTime dt)
        {
            int day = dt.Day;
            return dt.ToString("dddd") + " " + day + GetDaySuffix(day) + " " + dt.ToString("MMMM") + " " + dt.ToString("yyyy");
        }

        public static string? ToHumanizedStringWithTime(this DateTimeOffset? dt)
        {
            if (!dt.HasValue)
            {
                return null;
            }

            return dt.Value.ToString("dd").Replace("0", "") + GetDaySuffix(dt.Value.Day) + " " + dt.Value.ToString("MMMM") + " " + dt.Value.ToString("yyyy") + " @ " + dt.Value.ToString("HH:mm:ss");
        }

        public static string? ToReadableTime(this long? seconds)
        {
            if (!seconds.HasValue || seconds == 0)
            {
                return null;
            }

            var timeSpan = TimeSpan.FromSeconds(seconds.Value);

            if (timeSpan.TotalHours >= 1)
            {
                return $"{(int)timeSpan.TotalHours}h {timeSpan.Minutes}m {timeSpan.Seconds}s";
            }
            else if (timeSpan.TotalMinutes >= 1)
            {
                return $"{timeSpan.Minutes}m {timeSpan.Seconds}s";
            }
            else
            {
                return $"{timeSpan.Seconds}s";
            }
        }

        private static string GetDaySuffix(int day)
        {
            switch (day)
            {
                case 1:
                case 21:
                case 31:
                    return "st";
                case 2:
                case 22:
                    return "nd";
                case 3:
                case 23:
                    return "rd";
                default:
                    return "th";
            }
        }
    }
}

