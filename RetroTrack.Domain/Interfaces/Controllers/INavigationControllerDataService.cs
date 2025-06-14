﻿using RetroTrack.Domain.DTOs.Controllers.Navigation;
using RetroTrack.Domain.DTOs.Helpers;

namespace RetroTrack.Domain.Interfaces.Controllers
{
    public interface INavigationControllerDataService
    {
        Task<GetLoggedInNavigationDataDto> GetLoggedInNavigationData(UserDataDto userData);
        Task<GetPublicNavigationDataDto[]> GetPublicNavigationData();
    }
}
