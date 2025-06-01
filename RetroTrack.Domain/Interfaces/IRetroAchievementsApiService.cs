using RetroTrack.Domain.OldCode.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetroTrack.Domain.Interfaces
{
    public interface IRetroAchievementsApiService
    {
        Task<GetGameExtended?> GetSpecificGameInfo(int gameId);
        Task<bool> ValidateApiKey(string username, string raApiKey);
    }
}
