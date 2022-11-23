using RetroTrack.Domain.Dtos.LoggedIn.Navigation;
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
                var gameCounts = context.GameConsoles.ToDictionary(x => x.ConsoleID, x => x.GameCount);

                return new NavigationGameCountsDto
                {
                    AllGames = context.Games.Count(x => x.AchievementCount != 0),
                    Nintendo = new Nintendo
                    {
                        NintendoDS = $"{gameCounts[(int)GamesEnum.NintendoDS]} games",
                        GameBoy = $"{gameCounts[(int)GamesEnum.GameBoy]} games",
                        GameBoyColor = $"{gameCounts[(int)GamesEnum.GameBoyColour]} games",
                        GameBoyAdvance = $"{gameCounts[(int)GamesEnum.GameBoyAdvance]} games",
                        NES = $"{gameCounts[(int)GamesEnum.NES]} games",
                        SNES = $"{gameCounts[(int)GamesEnum.SNES]} games",
                        Nintendo64 = $"{gameCounts[(int)GamesEnum.Nintendo64]} games",
                        PokemonMini = $"{gameCounts[(int)GamesEnum.PokemonMini]} games",
                        VirtualBoy = $"{gameCounts[(int)GamesEnum.VirtualBoy]} games"
                    },
                    Sony = new Sony
                    {
                        PlayStation = $"{gameCounts[(int)GamesEnum.PlayStation]} games",
                        PlayStation2 = $"{gameCounts[(int)GamesEnum.PlayStation2]} games",
                        PSP = $"{gameCounts[(int)GamesEnum.PlayStationPortable]} games"
                    },
                    Atari = new Atari
                    {
                        Atari2600 = $"{gameCounts[(int)GamesEnum.Atari2600]} games",
                        Atari7800 = $"{gameCounts[(int)GamesEnum.Atari7800]} games",
                        AtariJaguar = $"{gameCounts[(int)GamesEnum.AtariJaguar]} games",
                        AtariLynx = $"{gameCounts[(int)GamesEnum.AtariLynx]} games",
                    },
                    NEC = new NEC
                    {
                        PC8000 = $"{gameCounts[(int)GamesEnum.PC80008800]} games",
                        PCEngine = $"{gameCounts[(int)GamesEnum.PCEngine]} games",
                        PCFX = $"{gameCounts[(int)GamesEnum.PCFX]} games"
                    },
                    Sega = new Sega
                    {
                        Sega32X = $"{gameCounts[(int)GamesEnum.ThirtyTwoX]} games",
                        SegaCD = $"{gameCounts[(int)GamesEnum.SegaCD]} games",
                        SegaDreamcast = $"{gameCounts[(int)GamesEnum.Dreamcast]} games",
                        SegaSaturn = $"{gameCounts[(int)GamesEnum.Saturn]} games",
                        SG1000 = $"{gameCounts[(int)GamesEnum.SG1000]} games",
                        MasterSystem = $"{gameCounts[(int)GamesEnum.MasterSystem]} games",
                        GameGear = $"{gameCounts[(int)GamesEnum.GameGear]} games",
                        MegaDrive = $"{gameCounts[(int)GamesEnum.MegaDrive]} games",
                    },
                    Other = new Other
                    {
                        AmstradCPC = $"{gameCounts[(int)GamesEnum.AmstradCPC]} games",
                        AppleII = $"{gameCounts[(int)GamesEnum.AppleII]} games",
                        Arcade = $"{gameCounts[(int)GamesEnum.Arcade]} games",
                        Arduboy = $"{gameCounts[(int)GamesEnum.Arduboy]} games",
                        WASM4 = $"{gameCounts[(int)GamesEnum.WASM4]} games",
                        ColecoVision = $"{gameCounts[(int)GamesEnum.ColecoVision]} games",
                        FairchildChannelF = $"{gameCounts[(int)GamesEnum.FairchildChannelF]} games",
                        Intellivision = $"{gameCounts[(int)GamesEnum.Intellivision]} games",
                        MagnavoxOdyssey2 = $"{gameCounts[(int)GamesEnum.MagnavoxOdyssey2]} games",
                        MegaDuck = $"{gameCounts[(int)GamesEnum.MegaDuck]} games",
                        Vectrex = $"{gameCounts[(int)GamesEnum.Vectrex]} games",
                        MSX = $"{gameCounts[(int)GamesEnum.MSX]} games",
                        NeoGeoPocket = $"{gameCounts[(int)GamesEnum.NeoGeoPocket]} games",
                        ThreeDOInteractive = $"{gameCounts[(int)GamesEnum.ThreeDOInteractiveMultiplayer]} games",
                        WataraSupervision = $"{gameCounts[(int)GamesEnum.WataraSupervision]} games",
                        WonderSwan = $"{gameCounts[(int)GamesEnum.WonderSwan]} games"
                    }
                };
            }
        }
    }
}
