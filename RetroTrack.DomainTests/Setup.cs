using RetroTrack.Domain.Search;

namespace RetroTrack.DomainTests
{
    public class Tests
    {
        [OneTimeSetUp]
        public async Task Setup()
        {
            await SearchAlgorithm.LoadData();
        }
    }
}