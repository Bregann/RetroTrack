using Microsoft.AspNetCore.Http;
using RetroTrack.Domain.Database.Context;
using RetroTrack.Domain.Database.Models;
using RetroTrack.Domain.Interfaces.Helpers;
using System.Security.Claims;

namespace RetroTrack.Domain.Services.Helpers
{
    public class UserContextHelper(IHttpContextAccessor httpContextAccessor, AppDbContext context) : IUserContextHelper
    {

        public int GetUserId()
        {
            return int.Parse(httpContextAccessor.HttpContext!.User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        }

        public string GetUsername()
        {
            return httpContextAccessor.HttpContext!.User.FindFirst(ClaimTypes.Name)!.Value;
        }

        public User GetUser()
        {
            var userId = GetUserId();
            return context.Users.Find(userId)!;
        }
    }
}
