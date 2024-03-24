using Microsoft.EntityFrameworkCore;
using RetroTrack.Domain.Search.Enum;
using RetroTrack.Infrastructure.Database.Context;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetroTrack.Domain.Search
{
    public static class SearchAlgorithm
    {
        private static SearchData[] GameData = new SearchData[0];
        private static AchievementData[] AchievementData = new AchievementData[0];
        private static readonly int PageSize = 50;

        public static async Task LoadData()
        {
            using (var context = new DatabaseContext())
            {
                GameData = await context.Games.Select(x => new SearchData
                {
                    GameId = x.Id,
                    Console = x.GameConsole.ConsoleName,
                    GameTitle = x.Title,
                    GameIconUrl = x.ImageIcon,
                    AchievementCount = x.AchievementCount,
                    Genre = x.GameGenre,
                    PlayerCount = x.Players ?? 0,
                }).ToArrayAsync();

                AchievementData = await context.Achievements.Select(x => new AchievementData
                {
                    AchievementDescription = x.AchievementDescription,
                    AchievementId = x.Id,
                    AchievementDisplayOrder = x.DisplayOrder,
                    AchievementName = x.AchievementName,
                    AchievementPointValue = x.Points,
                    GameId = x.GameId
                }).ToArrayAsync();
            }
        }

        public static QueryResponse RunQuery(int pageNumber, QueryData query)
        {
            var skip = (pageNumber - 1) * PageSize;
            var take = PageSize;

            int[] gameIndexes = new int[take];

            int currentIndex = 0;
            int gamesBeforeBlock = 0;
            int gamesAfterBlock = 0;

            for (int i = 0; i < GameData.Length; i++)
            {
                var isValid = true;

                ref var game = ref GameData[i];

                if (isValid && query.NameFilters.Count > 0)
                {
                    foreach (var filter in query.NameFilters)
                    {
                        if (filter.FilterType == Enum.IncludeExcludeEnum.Includes)
                        {
                            if (!(game.GameTitle.IndexOf(filter.Value, StringComparison.OrdinalIgnoreCase) >= 0))
                            {
                                isValid = false;
                                break;
                            }
                        }
                        else
                        {
                            if (game.GameTitle.IndexOf(filter.Value, StringComparison.OrdinalIgnoreCase) >= 0)
                            {
                                isValid = false;
                                break;
                            }
                        }
                    }
                }

                if (isValid && query.AchievementCountFilters.Count > 0)
                {
                    foreach (var filter in query.AchievementCountFilters)
                    {
                        switch (filter.FilterType)
                        {
                            case NumberFilterEnum.GreaterThan:
                                isValid = game.AchievementCount > filter.Value;
                                break;
                            case NumberFilterEnum.GreaterThanOrEqualTo:
                                isValid = game.AchievementCount >= filter.Value;
                                break;
                            case NumberFilterEnum.EqualTo:
                                isValid = game.AchievementCount == filter.Value;
                                break;
                            case NumberFilterEnum.LessThanOrEqualTo:
                                isValid = game.AchievementCount <= filter.Value;
                                break;
                            case NumberFilterEnum.LessThan:
                                isValid = game.AchievementCount < filter.Value;
                                break;
                            case NumberFilterEnum.NotEqualTo:
                                isValid = game.AchievementCount != filter.Value;
                                break;
                        }

                        if (!isValid)
                        {
                            break;
                        }
                    }
                }

                if (!isValid)
                {
                    continue;
                }

                if (gamesBeforeBlock < skip)
                {
                    gamesBeforeBlock++;
                }
                else if (currentIndex != take)
                {
                    gameIndexes[currentIndex] = i;
                    currentIndex++;
                }
                else
                {
                    gamesAfterBlock++;
                }
            }

            var response = new QueryResponse();
            response.MoreItems = gamesAfterBlock != 0;
            response.NumberOfGames = gamesBeforeBlock + gamesAfterBlock + currentIndex;

            var results = new SearchData[currentIndex];

            for (int i = 0; i < currentIndex; i++)
            {
                var actualIndex = gameIndexes[i];

                ref var game = ref GameData[actualIndex];

                results[i] = new SearchData
                {
                    GameId = game.GameId,
                    GameTitle = game.GameTitle,
                    AchievementCount = game.AchievementCount,
                    Console = game.Console,
                    PlayerCount = game.PlayerCount,
                    GameIconUrl = game.GameIconUrl,
                    Genre = game.Genre
                };
            }

            response.Results = results;
            return response;
        }
    }
}
