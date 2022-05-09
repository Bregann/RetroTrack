using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using RestSharp;
using RetroAchievementTracker.Data.RetroAchievementsAPI.Models;
using RetroAchievementTracker.Database.Context;
using RetroAchievementTracker.Database.Models;
using RetroAchievementTracker.Services;
using Serilog;
using System.Text;

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
            var gamesWith0Achievements = new Dictionary<string, string>();


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

                var responseDeserialized = JsonConvert.DeserializeObject<GameInfoNoAchievements>(response.Content);

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
                    Title = game.Title,
                    ConsoleName = game.ConsoleName
                });

                gamesWith0Achievements.Add(game.Title, game.ConsoleName);

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

            if (gamesWith0Achievements.Count != 0)
            {
                await SendGridService.Send0AchievementGamesEmail(gamesWith0Achievements);
            }
        }

        public static async Task GetUserGamesProgress(string username)
        {
            //todo: add in a last updated - if its been more than 5 minutes then update
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
            var gamesToUpdate = responseDeserialized.OrderByDescending(x => x.HardcoreMode).DistinctBy(x => x.GameId).ToList();
            var gameIds = responseDeserialized.OrderByDescending(x => x.HardcoreMode).DistinctBy(x => x.GameId).Select(x => x.GameId).ToList();


            using (var context = new DatabaseContext())
            {
                context.UserGameProgress.RemoveRange(context.UserGameProgress.Where(x => x.Username == username));
                context.SaveChanges();

                using (var transaction = context.Database.BeginTransaction())
                {
                    foreach (var game in gamesToUpdate)
                    {
                        //weird bug with some games - says null max achievements/percentage so prevent crashing with the deralised object as nullable
                        double pct = 0;
                        if (game.PctWon != null)
                        {
                            pct = (double)game.PctWon;
                        }

                        var newImprogressGames = new UserGameProgress
                        {
                            AchievementsGained = game.AchievementsAwarded,
                            GameID = game.GameId,
                            GameName = game.Title,
                            HardcoreMode = game.HardcoreMode,
                            UsernameGameID = $"{username}-{game.GameId}",
                            Username = username,
                            ConsoleID = game.ConsoleId,
                            GamePercentage = pct
                        };

                        await context
                            .UserGameProgress
                            .Upsert(newImprogressGames).
                            On(v => v.UsernameGameID)
                            .WhenMatched((inprogressGame, inprogressGameList) => new UserGameProgress
                            {
                                AchievementsGained = inprogressGame.AchievementsGained,
                                GamePercentage = inprogressGame.GamePercentage
                            })
                            .RunAsync();
                    }

                    context.SaveChanges();
                    transaction.Commit();
                }
            }

            Log.Information($"[RetroAchievements] In progress games updated for {username}");
        }

        public static async Task<GameInfo> GetSpecificGameInfo(int gameId)
        {
            var client = new RestClient(BaseUrl);

            //Get the response and deserialise
            var request = new RestRequest($"API_GetGameExtended.php?z={Username}&y={ApiKey}&i={gameId}", Method.Get);
            var response = await client.ExecuteAsync(request);

            if (response.Content == "" || response.Content == null || response.StatusCode != System.Net.HttpStatusCode.OK)
            {
                Log.Warning($"[RetroAchievements] Error getting game data for {gameId}");
                return null;
            }

            return JsonConvert.DeserializeObject<GameInfo>(response.Content);
        }

        public static async Task<GetGameInfoAndUserProgress> GetSpecificGameInfoAndUserProgress(int gameId, string username)
        {
            var client = new RestClient(BaseUrl);

            //Get the response and deserialise
            var request = new RestRequest($"API_GetGameInfoAndUserProgress.php?z={Username}&y={ApiKey}&g={gameId}&u={username}", Method.Get);
            var response = await client.ExecuteAsync(request);

            if (response.Content == "" || response.Content == null || response.StatusCode != System.Net.HttpStatusCode.OK)
            {
                Log.Warning($"[RetroAchievements] Error getting game data for {gameId}");
                return null;
            }

            return JsonConvert.DeserializeObject<GetGameInfoAndUserProgress>(response.Content);
        }

        //If they change the API - go back to original idea of GetGamesWith0AchievementsAndCheckForAchievements
        public static async Task UpdateGameAchievementCounts()
        {
            var gamesList = new List<Games>();

            //Get all the game IDs from the database
            using (var context = new DatabaseContext())
            {
                gamesList = context.Games.ToList();
            }

            var timesToLoop = gamesList.Count / 100;
            var gamesToUpdate = new List<Games>();

            //Loop through 100 games at a time to not hit the API too hard
            for (int i = 0; i < timesToLoop; i++)
            {
                var sb = new StringBuilder();

                //Get 100 games from the list
                var games = gamesList.Take(new Range(i * 100, (i * 100) + 100));

                //Append each game to the stringbuilder for the API request
                foreach (var game in games)
                {
                    sb.Append(game.Id + ",");
                }

                //Create the request with the data
                var client = new RestClient(BaseUrl);
                var request = new RestRequest($"API_GetUserProgress.php?z={Username}&y={ApiKey}&u=guinea&i={sb.Remove(sb.Length - 1, 1)}", Method.Get); //Remove the final , at the end

                //Get the response and Deserialize
                var response = await client.ExecuteAsync(request);

                if (response.Content == "" || response.Content == null || response.StatusCode != System.Net.HttpStatusCode.OK)
                {
                    Log.Warning($"[RetroAchievements] Error getting data for batch {i}");
                    continue;
                }

                //Deseralise the response
                var responseDeserialized = JsonConvert.DeserializeObject<Dictionary<int, GetUserProgress>>(response.Content);

                //Remove the games that don't need updating
                foreach (var game in responseDeserialized)
                {
                    var gameFromDb = gamesList.Where(x => x.Id == game.Key).First();

                    //Check if they have the same achievement counts
                    if (game.Value.NumPossibleAchievements == gameFromDb.AchievementCount)
                    {
                        continue;
                    }
                    else
                    {
                        //If there's a match then update it
                        gameFromDb.AchievementCount = game.Value.NumPossibleAchievements;
                        gameFromDb.IsProcessed = false; //Set not processed to queue it up on the next update
                        gameFromDb.DateAdded = DateTime.Now;
                        gamesToUpdate.Add(gameFromDb);

                        Log.Information($"[RetroAchievements] Game {gameFromDb.Title} ready to update. New achievement count - {game.Value.NumPossibleAchievements}");
                    }
                }

                Log.Information($"[RetroAchievements] Batch {i} ready to update");
                await Task.Delay(400); //wait a bit so we don't keep spamming the api
            }

            Log.Information($"[RetroAchievements] {gamesToUpdate.Count} games to update");

            //Update the games left
            using (var context = new DatabaseContext())
            {
                using (var transaction = context.Database.BeginTransaction())
                {
                    context.Games.UpdateRange(gamesToUpdate);

                    context.SaveChanges();
                    transaction.Commit();
                }
            }

            Log.Information($"[RetroAchievements] {gamesToUpdate.Count} games updated");
        }

        public static async Task<GetUserSummary> GetUserProfileData(string username)
        {
            var client = new RestClient(BaseUrl);

            //Get the response and deserialise
            var request = new RestRequest($"API_GetUserSummary.php?z={Username}&y={ApiKey}&u={username}", Method.Get);
            var response = await client.ExecuteAsync(request);

            if (response.Content == "" || response.Content == null || response.StatusCode != System.Net.HttpStatusCode.OK)
            {
                Log.Warning($"[RetroAchievements] Error getting profile data for {username}");
                return null;
            }

            var userSummary = JsonConvert.DeserializeObject<GetUserSummary>(response.Content);

            using (var context = new DatabaseContext())
            {
                userSummary.GamesCompleted = context.UserGameProgress.Where(x => x.GamePercentage == 1 && x.Username == username).ToList().Count;
            }

            return userSummary;
        }
    }
}
