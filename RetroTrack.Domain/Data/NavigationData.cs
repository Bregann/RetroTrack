using RetroTrack.Domain.Data.External;
using RetroTrack.Domain.Dtos;
using RetroTrack.Domain.Enums;
using RetroTrack.Infrastructure.Database.Context;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetroTrack.Domain.Data
{
    public class NavigationData
    {
        public static NavigationGameCountsDto GetGameCounts()
        {
            using (var context = new DatabaseContext())
            {
                var gamesDict = context.GameConsoles.Where(x => x.GameCount != 0).ToDictionary(x => x.ConsoleID, x => x.GameCount);
                gamesDict.Add(-1, context.GameConsoles.Sum(x => x.GameCount));

                return new NavigationGameCountsDto
                {
                    Games = gamesDict
                };
            }
        }

        public static LoggedInNavigationGameCountsDto GetGameCountsLoggedIn(string username)
        {
            using (var context = new DatabaseContext())
            {
                //Get the consoles and the user completed games
                var gameConsoles = context.GameConsoles.Where(x => x.GameCount != 0).ToDictionary(x => x.ConsoleID, x => x.GameCount);
                var percentage = context.UserGameProgress.Where(x => x.User.Username == username && x.GamePercentage == 1).Select(x => x.Game.Id).ToList();

                var dataDict = new Dictionary<int, NavigationUserStats>();

                foreach (var console in gameConsoles)
                {
                    var gamesCompleted = percentage.Where(x => x == console.Key).Count();
                    var consoleCompletion = Math.Round(100 * ((decimal)gamesCompleted / console.Value), 2);

                    dataDict.Add(console.Key, new NavigationUserStats
                    {
                        GamesTotalAndCompleted = $"{gamesCompleted}/{console.Value} ({consoleCompletion}%)",
                        Percentage = consoleCompletion
                    });
                }

                var totalGames = gameConsoles.Sum(x => x.Value);
                var allGamesCompletion = Math.Round(100 * ((decimal)percentage.Count / totalGames), 2);

                dataDict.Add(-1, new NavigationUserStats
                {
                    GamesTotalAndCompleted = $"{percentage.Count}/{totalGames} ({allGamesCompletion}%)",
                    Percentage = allGamesCompletion
                });

                return new LoggedInNavigationGameCountsDto
                {
                    Games = dataDict,
                    GamesTracked = context.TrackedGames.Where(x => x.User.Username == username).Count(),
                    InProgressGames = context.UserGameProgress.Where(x => x.User.Username == username && x.GamePercentage != 1).Count()
                };
            }
        }

        public static UserNavProfileDto? GetUserNavProfileData(string username)
        {
            using (var context = new DatabaseContext())
            {
                var user = context.Users.Where(x => x.Username == username.ToLower()).FirstOrDefault();

                if (user == null)
                {
                    return null;
                }


                return new UserNavProfileDto
                {
                    Username = username,
                    ProfileImageUrl = "https://retroachievements.org" + user.UserProfileUrl,
                    GamesCompleted = context.UserGameProgress.Where(x => x.User.Username == username && x.GamePercentage == 1).ToList().Count,
                    Points = user.UserPoints,
                    Rank = user.UserRank
                };
            }

        }
    }
}
