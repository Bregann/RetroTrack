using Microsoft.EntityFrameworkCore;
using RetroTrack.Domain.Database.Context;
using RetroTrack.Domain.DTOs.Controllers.Emulators.Responses;
using RetroTrack.Domain.Interfaces.Controllers;

namespace RetroTrack.Domain.Services.Controllers
{
    public class EmulatorControllerDataService(AppDbContext context) : IEmulatorControllerDataService
    {
        public async Task<GetEmulatorConfigResponse> GetEmulatorConfig()
        {
            var emulators = await context.Emulators
                .OrderBy(e => e.SortOrder)
                .Select(e => new EmulatorDto
                {
                    Id = e.Id,
                    Name = e.Name,
                    DefaultExe = e.DefaultExe,
                    IsEnabled = e.IsEnabled,
                    SortOrder = e.SortOrder,
                    SupportedConsoles = e.EmulatorConsoles
                        .Select(ec => new EmulatorConsoleSupportDto
                        {
                            ConsoleId = ec.ConsoleId,
                            ConsoleName = ec.GameConsole.ConsoleName
                        })
                        .ToArray(),
                    Cores = e.EmulatorCores
                        .Select(c => new EmulatorCoreDto
                        {
                            Id = c.Id,
                            CoreName = c.CoreName,
                            CoreFileName = c.CoreFileName,
                            SupportedConsoleIds = c.EmulatorCoreConsoles
                                .Select(cc => cc.ConsoleId)
                                .ToArray()
                        })
                        .ToArray()
                })
                .ToArrayAsync();

            return new GetEmulatorConfigResponse
            {
                Emulators = emulators
            };
        }
    }
}
