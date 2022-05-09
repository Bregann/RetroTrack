using SendGrid;
using SendGrid.Helpers.Mail;
using Serilog;
using System.Text;

namespace RetroAchievementTracker.Services
{
    public class SendGridService
    {
        private static readonly string ApiKey = "";

        public static async Task Send0AchievementGamesEmail(Dictionary<string, string> gamesToSend)
        {
            //Setup the email
            var client = new SendGridClient(ApiKey);
            var from = new EmailAddress("raupdates@bregan.me", "RetroAchievement Tracker Updates");
            var subject = $"Games with 0 achievements - {DateTime.Now.Date}";
            var to = new EmailAddress("ra@bregan.me", "Owner");
            var plainTextContent = new StringBuilder();

            foreach (var game in gamesToSend)
            {
                plainTextContent.AppendLine($"{game.Key} - {game.Value}");
            }

            var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent.ToString(), null);
            var response = await client.SendEmailAsync(msg);

            if (response != null)
            {
                if (response.IsSuccessStatusCode)
                {
                    Log.Information("[SendGrid] Email sent successfully!");
                }
                else
                {
                    Log.Fatal($"[SendGrid] Error sending email - {response.StatusCode}. Reason {response.Body}");
                }
            }
        }
    }
}
