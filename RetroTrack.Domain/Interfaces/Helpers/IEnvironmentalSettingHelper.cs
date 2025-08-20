using RetroTrack.Domain.Enums;

namespace RetroTrack.Domain.Interfaces.Helpers
{
    public interface IEnvironmentalSettingHelper
    {
        Task LoadEnvironmentalSettings();
        string? TryGetEnviromentalSettingValue(EnvironmentalSettingEnum key);
        Task<bool> UpdateEnviromentalSettingValue(EnvironmentalSettingEnum key, string newValue);
    }
}