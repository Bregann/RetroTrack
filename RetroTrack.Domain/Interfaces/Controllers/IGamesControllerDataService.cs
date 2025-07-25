﻿using RetroTrack.Domain.DTOs.Controllers.Games.Requests;
using RetroTrack.Domain.DTOs.Controllers.Games.Responses;

namespace RetroTrack.Domain.Interfaces.Controllers
{
    public interface IGamesControllerDataService
    {
        Task<GetRecentlyAddedAndUpdatedGamesResponse> GetRecentlyAddedAndUpdatedGames();
        Task<GetGamesForConsoleResponse> GetGamesForConsole(GetGamesForConsoleRequest request);
        Task<GetPublicSpecificGameInfoResponse?> GetPublicSpecificGameInfo(int gameId);
        Task<GetLoggedInSpecificGameInfoResponse?> GetLoggedInSpecificGameInfo(int userId, int gameId);
        Task<GetUserProgressForConsoleResponse> GetUserProgressForConsole(int userId, GetUserProgressForConsoleRequest request);
    }
}
