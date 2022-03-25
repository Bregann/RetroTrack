namespace RetroAchievementTracker.Data.TableData
{
    public class TableData
    {
        public int Id { get; set; }
        public string Genre { get; set; }
        public string ImageIconUrl { get; set; }
        public int PlayersCasual { get; set; }
        public int PlayersHardcore { get; set; }
        public string Title { get; set; }
        public int AchievementsGained { get; set; }
        public int AchievementCount { get; set; }
        public double GamePercentage { get; set; }
    }
}
