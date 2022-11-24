using RetroTrack.Domain.Dtos;
using RetroTrack.Domain.Enums;
using RetroTrack.Infrastructure.Database.Context;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetroTrack.Domain.Data.Public.Navigation
{
    public class Navigation
    {
        public static NavigationGameCountsDto GetGameCounts()
        {
            using(var context = new DatabaseContext())
            {
                return new NavigationGameCountsDto 
                { 
                    Games = context.GameConsoles.ToDictionary(x => x.ConsoleID, x => x.GameCount) 
                };
            }
        }

        public static LoggedInNavigationGameCountsDto GetGameCountsLoggedIn(string username)
        {

            using (var context = new DatabaseContext())
            {
                //Get the consoles and the user completed games
                var gameConsoles = context.GameConsoles.Where(x => x.GameCount != 0).ToDictionary(x => x.ConsoleID, x => x.GameCount);
                var percentage = context.UserGameProgress.Where(x => x.User.Username == username && x.GamePercentage == 1).Select(x => x.ConsoleID).ToList();

                var dataDict = new Dictionary<int, NavigationUserStats>();

                foreach (var console in gameConsoles)
                {
                    var gamesCompleted = percentage.Where(x => x == console.Key).Count();

                    dataDict.Add(console.Key, new NavigationUserStats 
                    { 
                        GamesCompleted = gamesCompleted, 
                        GamesTotal = console.Value, 
                        Percentage = $"{Math.Round((double)(gamesCompleted / console.Value) * 100, 2)}%" 
                    });
                }

                return new LoggedInNavigationGameCountsDto 
                { 
                    Games = dataDict 
                };
            }
        }
    }
}
