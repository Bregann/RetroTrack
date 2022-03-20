using RestSharp;
using RetroAchievementTracker.Database.Context;
using Serilog;

namespace RetroAchievementTracker.Data.Login
{
    public class LoginService
    {
        public static async Task<LoginData> LogUserIn(string username, string apiKey)
        {
            int userCount;
            //Check if they already exist
            using (var context = new DatabaseContext())
            {
                userCount = context.UserData.Where(x => x.Username == username).Count();
            }

            //If they don't then attempt an api request with their api key
            if (userCount == 0)
            {
                var client = new RestClient("https://retroachievements.org/API/");
                var request = new RestRequest($"API_GetConsoleIDs.php?z={username}&y={apiKey}", Method.Get);

                //Get the response and Deserialize
                var response = await client.ExecuteAsync(request);

                //Make sure it hasn't errored
                if (response.Content == "" || response.Content == null || response.StatusCode != System.Net.HttpStatusCode.OK)
                {
                    Log.Warning($"[RetroAchievements] Error valding API key for user {username}");

                    return new LoginData
                    {
                        Succesful = false,
                        Reason = "There has been a error connecting to RetroAchievements. Please try again later"
                    };
                }

                //Now to finally check if it was valid request or not
                if (response.Content == "Invalid API Key")
                {
                    return new LoginData
                    {
                        Succesful = false,
                        Reason = "Invalid Username/API Key"
                    };
                }

                //Hash the api key
                var hashedApiKey = BCrypt.Net.BCrypt.HashPassword(apiKey);

                //Create a login token
                var loginToken = $"D{DateTime.Now.Ticks/73}G{Guid.NewGuid()}";

                //As it didn't error we insert the data into the table
                using (var context = new DatabaseContext())
                {
                    context.UserData.Add(new Database.Models.UserData
                    {
                        HashedApiKey = hashedApiKey,
                        Username = username,
                        LoginToken = loginToken
                    });

                    context.SaveChanges();
                }

                return new LoginData
                {
                    LoginToken = loginToken,
                    Succesful = true
                };
            }
            else
            {
                //Validate if it's the correct API key in the database
                string apiKeyFromDb;
                using (var context = new DatabaseContext())
                {
                    apiKeyFromDb = context.UserData.Single(x => x.Username == username).HashedApiKey;
                }

                //Verify if its the same, if so then return with the data
                var isMatch = BCrypt.Net.BCrypt.Verify(apiKey, apiKeyFromDb);

                if (isMatch == true)
                {
                    //Create a login token
                    var loginTokenMatch = $"D{DateTime.Now.Ticks / 73}G{Guid.NewGuid()}";

                    //Update the DB
                    using (var context = new DatabaseContext())
                    {
                        var userDataToUpdate = context.UserData.Single(x => x.Username == username);
                        userDataToUpdate.LoginToken = loginTokenMatch;

                        context.SaveChanges();
                    }
                    return new LoginData
                    {
                        LoginToken = loginTokenMatch,
                        Succesful = true
                    };
                }

                //There is a chance that the api key may have changed so verify this before actually returning invalid
                var client = new RestClient("https://retroachievements.org/API/");
                var request = new RestRequest($"API_GetConsoleIDs.php?z={username}&y={apiKey}", Method.Get);

                //Get the response and Deserialize
                var response = await client.ExecuteAsync(request);

                //Make sure it hasn't errored
                if (response.Content == "" || response.Content == null || response.StatusCode != System.Net.HttpStatusCode.OK)
                {
                    Log.Warning($"[RetroAchievements] Error valding API key for user {username}");

                    return new LoginData
                    {
                        Succesful = false,
                        Reason = "There has been a error connecting to RetroAchievements. Please try again later"
                    };
                }

                //Now to finally check if it was valid request or not
                if (response.Content == "Invalid API Key")
                {
                    return new LoginData
                    {
                        Succesful = false,
                        Reason = "Invalid Username/API Key"
                    };
                }

                //As it's valid we need to rehash it and update the database

                //Hash the api key and generate a token
                var hashedApiKey = BCrypt.Net.BCrypt.HashPassword(apiKey);
                var loginTokenUpdate = $"D{DateTime.Now.Ticks / 73}G{Guid.NewGuid()}";

                using (var context = new DatabaseContext())
                {
                    var userDataToUpdate = context.UserData.Single(x => x.Username == username);
                    userDataToUpdate.HashedApiKey = hashedApiKey;
                    userDataToUpdate.LoginToken = loginTokenUpdate;

                    context.SaveChanges();
                }

                return new LoginData
                {
                    LoginToken = loginTokenUpdate,
                    Succesful = true
                };
            }
        }
    }
}
