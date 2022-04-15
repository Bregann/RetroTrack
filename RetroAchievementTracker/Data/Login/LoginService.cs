using RestSharp;
using RetroAchievementTracker.Database.Context;
using Serilog;

namespace RetroAchievementTracker.Data.Login
{
    public class LoginService
    {
        public static async Task<LoginData> RegisterNewUser(string username, string apiKey, string password)
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

                //Hash the api key and password
                var hashedApiKey = BCrypt.Net.BCrypt.HashPassword(apiKey);
                var hashedPassword = BCrypt.Net.BCrypt.HashPassword(password);

                //Create a login token
                var loginToken = $"D{DateTime.Now.Ticks / 73}G{Guid.NewGuid()}";

                //As it didn't error we insert the data into the table
                using (var context = new DatabaseContext())
                {
                    context.UserData.Add(new Database.Models.UserData
                    {
                        HashedApiKey = hashedApiKey,
                        Username = username,
                        LoginToken = loginToken,
                        HashedPassword = hashedPassword
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
                return new LoginData
                {
                    Reason = "User already registered",
                    Succesful = false
                };
            }
        }

        public static async Task<LoginData> ResetPassword(string username, string apiKey, string password)
        {
            int userCount;

            //Checkif the user exists
            using (var context = new DatabaseContext())
            {
                userCount = context.UserData.Where(x => x.Username == username).Count();
            }

            if (userCount == 0)
            {
                return new LoginData
                {
                    Reason = "User doesn't exist",
                    Succesful = false
                };
            }

            //Do a request to validate their api key
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

            //Hash the api key and password
            var hashedApiKey = BCrypt.Net.BCrypt.HashPassword(apiKey);
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(password);

            //Update it all in the database
            using (var context = new DatabaseContext())
            {
                var userToUpdate = context.UserData.Where(x => x.Username == username).FirstOrDefault();
                userToUpdate.HashedPassword = hashedPassword;
                userToUpdate.HashedApiKey = hashedApiKey;

                context.UserData.Update(userToUpdate);
                context.SaveChanges();
            }

            return new LoginData
            {
                Succesful = true,
                Reason = "Password reset! You may login now"
            };
        }

        public static LoginData LogUserIn(string username, string password)
        {
            //Validate if it's the correct password in the database
            string passwordFromDb;

            using (var context = new DatabaseContext())
            {
                var userData = context.UserData.Where(x => x.Username == username).FirstOrDefault();

                if (userData == null)
                {
                    return new LoginData
                    {
                        Reason = "Incorrect username/password",
                        Succesful = false
                    };
                }
                else
                {
                    passwordFromDb = context.UserData.Single(x => x.Username == username).HashedPassword;
                }
            }

            //Verify if its the same, if so then return with the data
            var isMatch = BCrypt.Net.BCrypt.Verify(password, passwordFromDb);

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
            else
            {
                return new LoginData
                {
                    Reason = "Incorrect username/password",
                    Succesful = false
                };
            }
        }

        public static bool ValidateUserLogin(string loginToken)
        {
            using (var context = new DatabaseContext())
            {
                return context.UserData.Where(x => x.LoginToken == loginToken).Count() != 0;
            }
        }

        public static string? GetLoggedInUser(string loginToken)
        {
            using (var context = new DatabaseContext())
            {
                return context.UserData.Where(x => x.LoginToken == loginToken).Select(x => x.Username).FirstOrDefault();
            }
        }
    }
}
