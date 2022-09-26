﻿using RetroAchievementTracker.Database.Context;
using RetroAchievementTracker.Database.Models;

namespace RetroAchievementTracker.Data.TableData
{
    public class TableDataService
    {
        public List<TableData> GetConsoleTableData(int consoleId, string? username = null)
        {
            var gameList = new List<Games>();
            var inProgressGames = new List<UserGameProgress>();

            //Get all the games from the console
            using (var context = new DatabaseContext())
            {
                gameList = context.Games.Where(x => x.ConsoleID == consoleId && x.AchievementCount != 0).ToList();

                //Check if it's not null and populate the list
                if (username != null)
                {
                    inProgressGames = context.UserGameProgress.Where(x => x.Username == username && x.ConsoleID == consoleId).ToList();
                }
            }

            //Get the game IDs in progress to check against the foreach loop
            var gameIdsInProgress = inProgressGames.Select(x => x.GameID).ToList();

            var tableData = new List<TableData>();

            //Add the games into the table data
            foreach (var game in gameList)
            {
                var achievementsGained = 0;
                double progress = 0;

                if (gameIdsInProgress.Contains(game.Id))
                {
                    achievementsGained = inProgressGames.Where(x => x.GameID == game.Id).Select(x => x.AchievementsGained).First();
                    progress = inProgressGames.Where(x => x.GameID == game.Id).Select(x => x.GamePercentage).First();
                }

                tableData.Add(new TableData
                {
                    Genre = game.GameGenre,
                    Id = game.Id,
                    PlayersCasual = (int)game.PlayersCasual,
                    PlayersHardcore = (int)game.PlayersHardcore,
                    Title = game.Title,
                    ImageIconUrl = "https://s3-eu-west-1.amazonaws.com/i.retroachievements.org/Images/" + game.ImageIcon,
                    AchievementsGained = achievementsGained,
                    GamePercentage = progress,
                    AchievementCount = (int)game.AchievementCount
                });
            }

            return tableData;
        }

        public List<TableData> GetAllConsolesDataTable(string? username = null)
        {
            var gameList = new List<Games>();
            var inProgressGames = new List<UserGameProgress>();

            //Get all the games from the console
            using (var context = new DatabaseContext())
            {
                gameList = context.Games.Where(x => x.AchievementCount != 0).ToList();

                //Check if it's not null and populate the list
                if (username != null)
                {
                    inProgressGames = context.UserGameProgress.Where(x => x.Username == username).ToList();
                }
            }

            //Get the game IDs in progress to check against the foreach loop
            var gameIdsInProgress = inProgressGames.Select(x => x.GameID).ToList();

            var tableData = new List<TableData>();

            //Add the games into the table data
            foreach (var game in gameList)
            {
                var achievementsGained = 0;
                double progress = 0;

                if (gameIdsInProgress.Contains(game.Id))
                {
                    achievementsGained = inProgressGames.Where(x => x.GameID == game.Id).Select(x => x.AchievementsGained).First();
                    progress = inProgressGames.Where(x => x.GameID == game.Id).Select(x => x.GamePercentage).First();
                }

                tableData.Add(new TableData
                {
                    Genre = game.GameGenre,
                    Id = game.Id,
                    PlayersCasual = (int)game.PlayersCasual,
                    PlayersHardcore = (int)game.PlayersHardcore,
                    Title = game.Title,
                    ImageIconUrl = "https://s3-eu-west-1.amazonaws.com/i.retroachievements.org/Images/" + game.ImageIcon,
                    AchievementsGained = achievementsGained,
                    GamePercentage = progress,
                    AchievementCount = (int)game.AchievementCount
                });
            }

            return tableData;
        }

        public List<TableData> GetTrackedGameTableData(string username)
        {
            //Get the tracked users games
            var gameList = new List<Games>();
            var inProgressGames = new List<UserGameProgress>();

            using (var context = new DatabaseContext())
            {
                //Get the game ID's of the tracked games
                var userTrackedGameIds = context.TrackedGames.Where(x => x.Username == username).Select(x => x.GameID).ToList();

                //Add all the games into the gamelist
                gameList.AddRange(userTrackedGameIds.Select(id => context.Games.Where(x => x.Id == id).First()));

                //Get the inprogress games
                inProgressGames = context.UserGameProgress.Where(x => x.Username == username).ToList();
            }

            //Get the game IDs in progress to check against the foreach loop
            var gameIdsInProgress = inProgressGames.Select(x => x.GameID).ToList();

            var tableData = new List<TableData>();

            //Add the games into the table data
            foreach (var game in gameList)
            {
                var achievementsGained = 0;
                double progress = 0;

                if (gameIdsInProgress.Contains(game.Id))
                {
                    achievementsGained = inProgressGames.Where(x => x.GameID == game.Id).Select(x => x.AchievementsGained).First();
                    progress = inProgressGames.Where(x => x.GameID == game.Id).Select(x => x.GamePercentage).First();
                }

                tableData.Add(new TableData
                {
                    Genre = game.GameGenre,
                    Id = game.Id,
                    PlayersCasual = (int)game.PlayersCasual,
                    PlayersHardcore = (int)game.PlayersHardcore,
                    Title = game.Title,
                    ImageIconUrl = "https://s3-eu-west-1.amazonaws.com/i.retroachievements.org/Images/" + game.ImageIcon,
                    AchievementsGained = achievementsGained,
                    GamePercentage = progress,
                    AchievementCount = (int)game.AchievementCount
                });
            }

            return tableData;
        }

        public List<TableData> GetInProgressGameTableData(string username)
        {
            //Get the tracked users games
            var gameList = new List<Games>();
            var inProgressGames = new List<UserGameProgress>();

            using (var context = new DatabaseContext())
            {
                //Get the improgress games of the user
                inProgressGames = context.UserGameProgress.Where(x => x.Username == username && x.GamePercentage != 1).ToList();

                //Add all the games into the gamelist
                gameList.AddRange(inProgressGames.Select(id => context.Games.Where(x => x.Id == id.GameID).First()));
            }

            var tableData = new List<TableData>();

            //Add the games into the table data
            foreach (var game in gameList)
            {
                var achievementsGained = 0;
                double progress = 0;

                tableData.Add(new TableData
                {
                    Genre = game.GameGenre,
                    Id = game.Id,
                    PlayersCasual = (int)game.PlayersCasual,
                    PlayersHardcore = (int)game.PlayersHardcore,
                    Title = game.Title,
                    ImageIconUrl = "https://s3-eu-west-1.amazonaws.com/i.retroachievements.org/Images/" + game.ImageIcon,
                    AchievementsGained = inProgressGames.Where(x => x.GameID == game.Id).Select(x => x.AchievementsGained).First(),
                    GamePercentage = inProgressGames.Where(x => x.GameID == game.Id).Select(x => x.GamePercentage).First(),
                    AchievementCount = (int)game.AchievementCount
                });
            }

            return tableData;
        }
    }
}
