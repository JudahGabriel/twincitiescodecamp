using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TwinCitiesCodeCamp.Models
{
    public class Event
    {
        public string Id { get; set; }
        public string RegisterUrl { get; set; }
        public DateTime DateTime { get; set; }
        public string LocationFriendlyName { get; set; }
        public string Address { get; set; }
        public int Number { get; set; }
        public string SeasonYear { get; set; }
        public bool IsAcceptingTalkSubmissions { get; set; }
    }
}