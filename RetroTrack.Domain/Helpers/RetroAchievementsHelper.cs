using RetroTrack.Domain.Enums;

namespace RetroTrack.Domain.Helpers
{
    public class RetroAchievementsHelper
    {
        /// <summary>
        /// Converts the string representation of the highest award kind to the corresponding enum value.
        /// </summary>
        /// <param name="awardKind"></param>
        /// <returns></returns>
        public static HighestAwardKind? ConvertHighestAwardKind(string? awardKind)
        {
            if (awardKind == null)
            {
                return null;
            }

            switch (awardKind)
            {
                case "beaten-softcore":
                    return HighestAwardKind.BeatenSoftcore;
                case "beaten-hardcore":
                    return HighestAwardKind.BeatenHardcore;
                case "completed":
                    return HighestAwardKind.Completed;
                case "mastered":
                    return HighestAwardKind.Mastered;
                default:
                    return null;
            }
        }
    }
}
