using Microsoft.EntityFrameworkCore.Metadata;
using Newtonsoft.Json;
using RestSharp;
using RetroTrack.Domain.Dtos.External;
using RetroTrack.Domain.Dtos.Public;
using RetroTrack.Infrastructure.Database.Context;
using RetroTrack.Infrastructure.Database.Models;
using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Reflection.Metadata.Ecma335;
using System.Text;
using System.Threading.Tasks;

namespace RetroTrack.Domain.Data.External
{
    public class RetroAchievements
    {
        public static async Task<bool> ValidateApiKey(string username, string raApiKey)
        {
            var client = new RestClient(AppConfig.RetroAchievementsApiBaseUrl);
            var request = new RestRequest($"API_GetConsoleIDs.php?z={username}&y={raApiKey}", Method.Get);

            //Get the response and Deserialize
            var response = await client.ExecuteAsync(request);

            //Make sure it hasn't errored
            if (response.Content == "" || response.Content == null || response.StatusCode != HttpStatusCode.OK)
            {
                Log.Warning($"[Register User] Error valding API key for user {username}. Status code was {response.StatusCode}");
                return false;
            }

            return true;
        }

        public static async Task GetConsolesAndInsertToDatabase()
        {
            var client = new RestClient(AppConfig.RetroAchievementsApiBaseUrl);
            var request = new RestRequest($"API_GetConsoleIDs.php?z={AppConfig.RetroAchievementsApiUsername}&y={AppConfig.RetroAchievementsApiKey}", Method.Get);

            //Get the response and Deserialize
            var response = await client.ExecuteAsync(request);

            if (response.Content == "" || response.Content == null || response.StatusCode != System.Net.HttpStatusCode.OK)
            {
                Log.Warning($"[RetroAchievements] Error getting console data. Status code {response.StatusCode}");
                return;
            }

            var responseDeserialized = JsonConvert.DeserializeObject<List<ConsoleIDsDto>>(response.Content);

            //Add all the new consoles into the database
            using(var context = new DatabaseContext())
            {
                foreach (var console in responseDeserialized)
                {
                    //hubs and events are skipped
                    if (console.Id == 100 || console.Id == 101)
                    {
                        continue;
                    }

                    //Don't add it if it already exists
                    if (context.GameConsoles.Any(x => x.ConsoleID == console.Id))
                    {
                        Log.Information($"[RetroAchievements] Console ID {console.Id} already exists in DB");
                        continue;
                    }

                    await context.GameConsoles.AddAsync(new GameConsoles
                    {
                        ConsoleID = console.Id,
                        ConsoleName = console.Name,
                        GameCount = 0
                    });

                    Log.Information($"[RetroAchievements] Console ID {console.Id} added");
                }

                context.SaveChanges();
            }
        }
    }
}
