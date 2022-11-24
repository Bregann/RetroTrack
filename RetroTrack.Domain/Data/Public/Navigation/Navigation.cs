using RetroTrack.Domain.Dtos;
using RetroTrack.Domain.Enums;
using RetroTrack.Infrastructure.Database.Context;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetroTrack.Domain.Data.Public.Navigation
{
    public class Navigation
    {
        public static NavigationGameCountsDto GetGameCounts()
        {
            using(var context = new DatabaseContext())
            {
                return new NavigationGameCountsDto { Games = context.GameConsoles.ToDictionary(x => x.ConsoleID, x => x.GameCount) };
            }
        }
    }
}
