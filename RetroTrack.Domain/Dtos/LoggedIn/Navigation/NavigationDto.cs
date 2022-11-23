using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetroTrack.Domain.Dtos.LoggedIn.Navigation
{
    public class NavigationGameCountsDto
    {
        public required int AllGames { get; set; }
        public required Nintendo Nintendo { get; set; }
        public required Sony Sony { get; set; }
        public required Atari Atari { get; set; }
        public required NEC NEC { get; set; }
        public required Sega Sega { get; set; }
        public required Other Other { get; set; }
    }

    public class Nintendo
    {
        public required string GameBoy { get; set; }
        public required string GameBoyColor { get; set; }
        public required string GameBoyAdvance { get; set; }
        public required string NES { get; set; }
        public required string SNES { get; set; }
        public required string Nintendo64 { get; set; }
        public required string NintendoDS { get; set; }
        public required string PokemonMini { get; set; }
        public required string VirtualBoy { get; set; }
    }

    public class Sony
    {
        public required string PlayStation { get; set; }
        public required string PlayStation2 { get; set; }
        public required string PSP { get; set; }
    }

    public class Atari
    {
        public required string Atari2600 { get; set; }
        public required string Atari7800 { get; set; }
        public required string AtariJaguar { get; set; }
        public required string AtariLynx { get; set; }
    }

    public class NEC
    {
        public required string PCEngine { get; set;}
        public required string PC8000 { get; set;}
        public required string PCFX { get; set;}
    }

    public class Sega
    {
        public required string SG1000 { get; set;}
        public required string MasterSystem { get; set;}
        public required string GameGear { get; set;}
        public required string MegaDrive { get; set;}
        public required string SegaCD { get; set;}
        public required string Sega32X { get; set;}
        public required string SegaSaturn { get; set;}
        public required string SegaDreamcast { get; set;}
    }

    public class Other
    {
        public required string ThreeDOInteractive { get; set; }
        public required string AmstradCPC { get; set; }
        public required string AppleII { get; set; }
        public required string Arcade { get; set; }
        public required string Arduboy { get; set; }
        public required string ColecoVision { get; set; }
        public required string FairchildChannelF { get; set; }
        public required string Intellivision { get; set; }
        public required string MagnavoxOdyssey2 { get; set; }
        public required string MegaDuck { get; set; }
        public required string MSX { get; set; }
        public required string NeoGeoPocket { get; set; }
        public required string Vectrex { get; set; }
        public required string WASM4 { get; set; }
        public required string WataraSupervision { get; set; }
        public required string WonderSwan { get; set; }
    }
}
