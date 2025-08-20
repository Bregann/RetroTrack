namespace RetroTrack.Domain.Enums
{
    public enum ProcessingStatus
    {
        NotScheduled = 1,
        Scheduled = 2,
        BeingProcessed = 3,
        Processed = 4,
        Errored = 5,
    }
}
