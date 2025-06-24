namespace RetroTrack.Domain.Helpers
{
    public class DateTimeHelper
    {
        public static string HumanizeDateTime(DateTime dt)
        {
            int day = dt.Day;
            return dt.ToString("dddd") + " " + day + GetDaySuffix(day) + " " + dt.ToString("MMMM") + " " + dt.ToString("yyyy");
        }

        public static string? HumanizeDateTimeWithTime(DateTimeOffset? dt)
        {
            if (!dt.HasValue)
            {
                return null;
            }

            return dt.Value.ToString("dd").Replace("0", "") + GetDaySuffix(dt.Value.Day) + " " + dt.Value.ToString("MMMM") + " " + dt.Value.ToString("yyyy") + " @ " + dt.Value.ToString("HH:mm:ss");
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
