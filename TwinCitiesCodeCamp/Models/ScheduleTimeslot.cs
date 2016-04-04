using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TwinCitiesCodeCamp.Models
{
    public class ScheduleTimeslot
    {
        public double Start { get; set; }
        public double Duration { get; set; }
        public List<ScheduleItem> Items { get; set; } = new List<ScheduleItem>();
    }
}