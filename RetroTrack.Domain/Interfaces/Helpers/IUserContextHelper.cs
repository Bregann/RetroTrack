using RetroTrack.Domain.Database.Models;

namespace RetroTrack.Domain.Interfaces.Helpers
{
    public interface IUserContextHelper
    {
        int GetUserId();
        string GetUsername();
        User GetUser();
    }
}
