using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TwinCitiesCodeCamp.Models
{
    public class Sponsor
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Logo { get; set; }
        public string Url { get; set; }
        public string About { get; set; }
        public SponsorshipLevel Level { get; set; }
        public string EventId { get; set; }
        public string Twitter { get; set; }
        public DateTime CreateDate { get; set; }
    }
}