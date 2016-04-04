using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using TwinCitiesCodeCamp.Models;
using Raven.Client;
using System.Web.Http;

namespace TwinCitiesCodeCamp.Controllers
{
    [RoutePrefix("api/schedules")]  
    public class SchedulesController : RavenApiController
    {
        [Route("getscheduleforevent")]
        public Task<Schedule> GetScheduleForEvent(string eventId)
        {
            using (DbSession.Advanced.DocumentStore.AggressivelyCacheFor(TimeSpan.FromDays(7)))
            { 
                return DbSession.Query<Schedule>()
                    .FirstAsync(s => s.EventId == eventId);
            }
        }
    }
}