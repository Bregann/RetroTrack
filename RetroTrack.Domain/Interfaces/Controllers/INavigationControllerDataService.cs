using RetroTrack.Domain.DTOs.Controllers.Navigation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetroTrack.Domain.Interfaces.Controllers
{
    public interface INavigationControllerDataService
    {
        Task<GetPublicNavigationDataDto[]> GetPublicNavigationData();
    }
}
