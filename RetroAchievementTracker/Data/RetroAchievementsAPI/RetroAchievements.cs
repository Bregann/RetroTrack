using Newtonsoft.Json;
using RestSharp;
using RetroAchievementTracker.Data.RetroAchievementsAPI.Models;
using Serilog;
using RetroAchievementTracker.Database.Context;
using Microsoft.EntityFrameworkCore;
using RetroAchievementTracker.Database.Models;

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
                Log.Warning($"[RetroAchievements API] Error getting Console data");
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

                        //context.GameConsoles.Add(new Database.Models.GameConsoles { ConsoleID = console.Id, ConsoleName = console.Name });
                    }

                    context.SaveChanges();
                    transaction.Commit();
                }
            }
        }
    }
}
