using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetroTrack.Domain.Dtos.External
{
    public class ConsoleIDsDto
    {
        [JsonProperty("ID")]
        public int Id { get; set; }

        [JsonProperty("Name")]
        public string Name { get; set; }
    }
}
