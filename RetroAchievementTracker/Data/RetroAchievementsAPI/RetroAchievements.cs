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

            //Remove events and hubs
            responseDeserialized.RemoveAll(x => x.Id == 100);
            responseDeserialized.RemoveAll(x => x.Id == 101);

            //Insert the data into the db
            using (var context = new DatabaseContext())
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

        public static async Task GetGamesFromConsoleIdsAndUpdateGameCounts()
        {
            List<int>? consoleIds;
            using (var context = new DatabaseContext())
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
                        ConsoleName = game.ConsoleName,
                        Id = game.Id,
                        Title = game.Title,
                        ImageIcon = game.ImageIcon.Replace(@"/Images/", ""),
                        IsProcessed = false
                    });
                }

                Log.Information($"[RetroAchievements] Console ID {id} games successfully processed");
                await Task.Delay(400); //delay a bit to stop hitting the api too hard
            }

            using (var context = new DatabaseContext())
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

            using (var context = new DatabaseContext())
            {
                using (var transaction = context.Database.BeginTransaction())
                {
                    var list = new List<GameCounts>();

                    foreach (var console in consoleIds)
                    {
                        var gameCount = context.Games.Where(x => x.ConsoleID == console && x.AchievementCount != 0).Count();

                        if (gameCount != 0)
                        {
                            var newGameCount = new GameCounts
                            {
                                ConsoleId = console,
                                GameCount = gameCount
                            };

                            await context
                                .GameCounts
                                .Upsert(newGameCount).
                                On(v => v.ConsoleId)
                                .WhenMatched((console, consoleList) => new GameCounts
                                {
                                    GameCount = consoleList.GameCount
                                })
                                .RunAsync();
                        }
                    }

                    context.SaveChanges();
                    transaction.Commit();
                }
            }

            Log.Information($"[RetroAchievements] Game counts updated");
        }

        public static async Task UpdateUnprocessedGames()
        {
            List<Games> unprocessedGames;
            var gamesToUpdate = new List<Games>();

            using (var context = new DatabaseContext())
            {
                unprocessedGames = context.Games.Where(x => x.IsProcessed == false).ToList();
            }

            var client = new RestClient(BaseUrl);

            foreach (var game in unprocessedGames)
            {
                //Get the response and deserialise
                var request = new RestRequest($"API_GetGameExtended.php?z={Username}&y={ApiKey}&i={game.Id}", Method.Get);
                var response = await client.ExecuteAsync(request);

                if (response.Content == "" || response.Content == null || response.StatusCode != System.Net.HttpStatusCode.OK)
                {
                    Log.Warning($"[RetroAchievements] Error getting game data for {game.Title}");
                    continue;
                }

                var responseDeserialized = JsonConvert.DeserializeObject<GameInfo>(response.Content);

                if (responseDeserialized == null)
                {
                    Log.Warning($"[RetroAchievements] Error deserializing game data for {game.Title}");
                    continue;
                }

                //Add the game into a list to process
                gamesToUpdate.Add(new Games
                {
                    Id = responseDeserialized.Id,
                    ImageIcon = responseDeserialized.ImageIcon.Replace(@"/Images/", ""),
                    ImageIngame = responseDeserialized.ImageIngame.Replace(@"/Images/", ""),
                    ImageBoxArt = responseDeserialized.ImageBoxArt.Replace(@"/Images/", ""),
                    DateAdded = DateTime.Now,
                    GameGenre = responseDeserialized.Genre,
                    AchievementCount = responseDeserialized.AchievementCount,
                    PlayersCasual = responseDeserialized.PlayersCasual,
                    PlayersHardcore = responseDeserialized.PlayersHardcore,
                    IsProcessed = true,
                    ConsoleID = game.ConsoleID,
                    Title = game.Title
                });

                Log.Information($"[RetroAchievements] {game.Title} added to updates list");
                await Task.Delay(400); //delay a bit to stop hitting the api too hard
            }

            //Update all the games in the database and save it
            using (var context = new DatabaseContext())
            {
                using (var transaction = context.Database.BeginTransaction())
                {
                    context.Games.UpdateRange(gamesToUpdate);

                    context.SaveChanges();
                    transaction.Commit();
                }
            }

            Log.Information("[RetroAchievements] Games database updated");
        }

        //todo: Check and update games with 0 achievements - weekly job

        public static async Task GetUserCompletedGamesAndAddToDb(string username)
        {
            var client = new RestClient(BaseUrl);
            var request = new RestRequest($"API_GetUserCompletedGames.php?z={Username}&y={ApiKey}&u={username}", Method.Get);

            //Get the response and Deserialize
            var response = await client.ExecuteAsync(request);

            if (response.Content == "" || response.Content == null || response.StatusCode != System.Net.HttpStatusCode.OK)
            {
                Log.Warning("[RetroAchievements] Error getting Completed Games Data");
                return;
            }

            var responseDeserialized = JsonConvert.DeserializeObject<List<CompletedGamesData>>(response.Content);

            if (responseDeserialized.Count == 0)
            {
                Log.Information($"[RetroAchievements] No completed games found for {username}");
                return;
            }

            //Order the list so it only has hardcore first and no dupes
            var gamesToUpdate = responseDeserialized.Where(x => x.PctWon == 1).OrderByDescending(x => x.HardcoreMode).DistinctBy(x => x.GameId).ToList();
            var gameIds = responseDeserialized.Where(x => x.PctWon == 1).OrderByDescending(x => x.HardcoreMode).DistinctBy(x => x.GameId).Select(x => x.GameId).ToList();


            using (var context = new DatabaseContext())
            {
                context.CompletedGames.RemoveRange(context.CompletedGames.Where(x => x.Username == username));
                context.SaveChanges();

                using (var transaction = context.Database.BeginTransaction())
                {
                    //Select the game data for the in progress games
                    var gameDataForUpdates = context.Games
                                                .Where(x => gameIds.Contains(x.Id))
                                                .ToList();

                    foreach (var game in gamesToUpdate)
                    {
                        var newImprogressGames = new CompletedGames
                        {
                            AchievementsGained = game.AchievementsAwarded,
                            GameID = game.GameId,
                            GameName = game.Title,
                            HardcoreMode = game.HardcoreMode,
                            UsernameGameID = $"{username}-{game.GameId}",
                            Username = username,
                            ConsoleID = gameDataForUpdates.Where(x => x.Id == game.GameId).Select(x => x.ConsoleID).First()
                        };

                        await context
                            .CompletedGames
                            .Upsert(newImprogressGames).
                            On(v => v.UsernameGameID)
                            .WhenMatched((inprogressGame, inprogressGameList) => new CompletedGames
                            {
                                AchievementsGained = inprogressGame.AchievementsGained
                            })
                            .RunAsync();
                    }

                    context.SaveChanges();
                    transaction.Commit();
                }
            }

            Log.Information($"[RetroAchievements] In progress games updated for {username}");
        }
    }
}
