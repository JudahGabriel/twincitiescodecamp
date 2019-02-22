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
        public DateTimeOffset DateTime { get; set; }
        public string LocationFriendlyName { get; set; }
        public string Address { get; set; }
        public int Number { get; set; }
        public string SeasonYear { get; set; }
        public bool IsAcceptingTalkSubmissions { get; set; }
        public DateTimeOffset? NoTalkSubmissionsAfter { get; set; }

        public void CopyFrom(Event other)
        {
            this.RegisterUrl = other.RegisterUrl;
            this.DateTime = other.DateTime;
            this.LocationFriendlyName = other.LocationFriendlyName;
            this.Address = other.Address;
            this.Number = other.Number;
            this.SeasonYear = other.SeasonYear;
            this.IsAcceptingTalkSubmissions = other.IsAcceptingTalkSubmissions;
            this.NoTalkSubmissionsAfter = other.NoTalkSubmissionsAfter;
        }
    }
}