﻿using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetroTrack.Domain.Models
{
    public class ConsoleIDs
    {
        [JsonProperty("ID")]
        public int Id { get; set; }

        [JsonProperty("Name")]
        public string Name { get; set; }
    }

    public class GetGameList
    {
        [JsonProperty("Title")]
        public string Title { get; set; }

        [JsonProperty("ID")]
        public int Id { get; set; }

        [JsonProperty("ConsoleID")]
        public int ConsoleId { get; set; }

        [JsonProperty("ImageIcon")]
        public string ImageIcon { get; set; }

        [JsonProperty("NumAchievements")]
        public int AchievementCount { get; set; }

        [JsonProperty("DateModified")]
        public DateTime DateModified { get; set; }
    }
}
