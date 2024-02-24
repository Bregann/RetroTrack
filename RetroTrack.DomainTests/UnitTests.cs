using RetroTrack.Domain.Search;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetroTrack.DomainTests
{
    [TestFixture]
    [Parallelizable(ParallelScope.All)]
    public class UnitTests
    {
        [Test]
        [TestCase("something stupid", TestName = "Name of game")]
        public void Tests(string queryString)
        {
            var query = QueryParser.ParseData(queryString);

            var response = SearchAlgorithm.RunQuery(1, query);

            Assert.That(response.Length == 1, Is.True);
            Assert.That(response[0].GameTitle == TestContext.CurrentContext.Test.Name, Is.True);
        }
    }
}
