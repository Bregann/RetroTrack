using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetroTrack.Domain.Dtos
{
    public class LoggedInNavigationGameCountsDto
    {
    }


    public class NavigationGameCountsDto
    {
        public Dictionary<int, int> Games { get; set; }

    }

    public class Nintendo
    {
        public required int GameBoy { get; set; }
        public required int GameBoyColor { get; set; }
        public required int GameBoyAdvance { get; set; }
        public required int NES { get; set; }
        public required int SNES { get; set; }
        public required int Nintendo64 { get; set; }
        public required int NintendoDS { get; set; }
        public required int PokemonMini { get; set; }
        public required int VirtualBoy { get; set; }
    }

    public class Sony
    {
        public required int PlayStation { get; set; }
        public required int PlayStation2 { get; set; }
        public required int PSP { get; set; }
    }

    public class Atari
    {
        public required int Atari2600 { get; set; }
        public required int Atari7800 { get; set; }
        public required int AtariJaguar { get; set; }
        public required int AtariLynx { get; set; }
    }

    public class NEC
    {
        public required int PCEngine { get; set; }
        public required int PC8000 { get; set; }
        public required int PCFX { get; set; }
    }

    public class Sega
    {
        public required int SG1000 { get; set; }
        public required int MasterSystem { get; set; }
        public required int GameGear { get; set; }
        public required int MegaDrive { get; set; }
        public required int SegaCD { get; set; }
        public required int Sega32X { get; set; }
        public required int SegaSaturn { get; set; }
        public required int SegaDreamcast { get; set; }
    }

    public class Other
    {
        public required int ThreeDOInteractive { get; set; }
        public required int AmstradCPC { get; set; }
        public required int AppleII { get; set; }
        public required int Arcade { get; set; }
        public required int Arduboy { get; set; }
        public required int ColecoVision { get; set; }
        public required int FairchildChannelF { get; set; }
        public required int Intellivision { get; set; }
        public required int MagnavoxOdyssey2 { get; set; }
        public required int MegaDuck { get; set; }
        public required int MSX { get; set; }
        public required int NeoGeoPocket { get; set; }
        public required int Vectrex { get; set; }
        public required int WASM4 { get; set; }
        public required int WataraSupervision { get; set; }
        public required int WonderSwan { get; set; }
    }
}
