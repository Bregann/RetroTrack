using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RetroTrack.Domain.Search;

namespace RetroTrack.Api.Controllers.Search
{
    [Route("api/[controller]")]
    [ApiController]
    public class SearchController : ControllerBase
    {
        [HttpGet("SearchGame")]
        public QueryResponse SearchGame([FromQuery] int pageNum, [FromQuery] string q)
        {
            var query = QueryParser.ParseData(q);

            if (pageNum < 1)
            {
                pageNum = 1;
            }

            var response = SearchAlgorithm.RunQuery(pageNum, query);

            return response;
        }
    }
}
