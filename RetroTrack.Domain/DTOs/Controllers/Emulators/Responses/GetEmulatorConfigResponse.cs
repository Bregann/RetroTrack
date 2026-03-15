namespace RetroTrack.Domain.DTOs.Controllers.Emulators.Responses
{
    public class GetEmulatorConfigResponse
    {
        public required EmulatorDto[] Emulators { get; set; }
    }

    public class EmulatorDto
    {
        public required int Id { get; set; }
        public required string Name { get; set; }
        public required string DefaultExe { get; set; }
        public required bool IsEnabled { get; set; }
        public required int SortOrder { get; set; }
        public required EmulatorConsoleSupportDto[] SupportedConsoles { get; set; }
        public required EmulatorCoreDto[] Cores { get; set; }
    }

    public class EmulatorConsoleSupportDto
    {
        public required int ConsoleId { get; set; }
        public required string ConsoleName { get; set; }
    }

    public class EmulatorCoreDto
    {
        public required int Id { get; set; }
        public required string CoreName { get; set; }
        public required string CoreFileName { get; set; }
        public required int[] SupportedConsoleIds { get; set; }
    }
}
