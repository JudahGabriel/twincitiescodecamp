using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TwinCitiesCodeCamp.Models
{
    public class Schedule
    {
        public string Id { get; set; }
        public string EventId { get; set; }
        public List<ScheduleTimeslot> Timeslots { get; set; }
    }
}