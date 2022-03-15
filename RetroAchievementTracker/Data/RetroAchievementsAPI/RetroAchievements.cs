using Newtonsoft.Json;
using RestSharp;
using RetroAchievementTracker.Data.RetroAchievementsAPI.Models;
using Serilog;
using RetroAchievementTracker.Database.Context;
using Microsoft.EntityFrameworkCore;
using RetroAchievementTracker.Database.Models;
using System.Linq;

namespace RetroAchievementTracker.RetroAchievementsAPI
{
    public class RetroAchievements
    {
        private static readonly string Username = "";
        private static readonly string ApiKey = "";
        private static readonly string BaseUrl = "https://retroachievements.org/API/";
        public static async Task GetConsoleIDsAndInsertToDb()
        {
            var client = new RestClient(BaseUrl);
            var request = new RestRequest($"API_GetConsoleIDs.php?z={Username}&y={ApiKey}", Method.Get);

            //Get the response and Deserialize
            var response = await client.ExecuteAsync(request);

            if (response.Content == "" || response.Content == null || response.StatusCode != System.Net.HttpStatusCode.OK)
            {
                Log.Warning("[RetroAchievements] Error getting Console data");
                return;
            }

            var responseDeserialized = JsonConvert.DeserializeObject<List<ConsoleIDs>>(response.Content);

            //Insert the data into the db
            using (var context = new RetroAchievementTrackerContext())
            {
                using (var transaction = context.Database.BeginTransaction())
                {
                    foreach (var console in responseDeserialized)
                    {
                        await context.Upsert(new GameConsoles
                        {
                            ConsoleID = console.Id,
                            ConsoleName = console.Name
                        })
                        .On(v => v.ConsoleID)
                        .NoUpdate()
                        .RunAsync();
                    }

                    context.SaveChanges();
                    transaction.Commit();
                }
            }
        }

        public static async Task GetGamesFromConsoleIds()
        {
            List<int>? consoleIds;
            using (var context = new RetroAchievementTrackerContext())
            {
                consoleIds = context.GameConsoles.Select(x => x.ConsoleID).ToList();
            }

            var client = new RestClient(BaseUrl);
            var gameList = new List<Games>();

            foreach (var id in consoleIds)
            {
                //Get the response and Deserialize
                var request = new RestRequest($"API_GetGameList.php?z={Username}&y={ApiKey}&i={id}", Method.Get);
                var response = await client.ExecuteAsync(request);

                if (response.Content == "" || response.Content == null || response.StatusCode != System.Net.HttpStatusCode.OK)
                {
                    Log.Warning($"[RetroAchievements] Error getting games for console ID {id}");
                    continue;
                }

                var responseDeserialized = JsonConvert.DeserializeObject<List<GameList>>(response.Content);

                if (responseDeserialized == null)
                {
                    Log.Warning($"[RetroAchievements] Error deserializing games for console ID {id}");
                    continue;
                }

                //Remove the games that don't have artwork - these don't have achievements
                responseDeserialized.RemoveAll(x => x.ImageIcon == @"/Images/000001.png");

                //Add the games into the gamelist ready to add into db once all queries are done
                foreach (var game in responseDeserialized)
                {
                    gameList.Add(new Games
                    {
                        ConsoleID = game.ConsoleID,
                        Id = game.Id,
                        Title = game.Title,
                        imageIcon = game.ImageIcon.Replace(@"/Images/", ""),
                        IsProcessed = false
                    });
                }

                Log.Information($"[RetroAchievements] Console ID {id} games successfully processed");
                await Task.Delay(400); //delay a bit to stop hitting the api too hard
            }

            using (var context = new RetroAchievementTrackerContext())
            {
                using (var transaction = context.Database.BeginTransaction())
                {
                    await context
                        .Games
                        .UpsertRange(gameList).
                        On(v => v.Id)
                        .NoUpdate()
                        .RunAsync();

                    context.SaveChanges();
                    transaction.Commit();
                }
            }

            Log.Information($"[RetroAchievements] Games inserted to database");
        }
    }
}
