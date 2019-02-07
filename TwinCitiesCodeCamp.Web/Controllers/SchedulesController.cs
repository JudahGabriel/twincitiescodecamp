using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using TwinCitiesCodeCamp.Models;
using TwinCitiesCodeCamp.Common;
using Raven.Client;
using System.Web.Http;
using Microsoft.AspNetCore.Mvc;
using Raven.Client.Documents;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using Raven.Client.Documents.Session;

namespace TwinCitiesCodeCamp.Controllers
{
    [Route("api/[controller]/[action]")]  
    public class SchedulesController : RavenController
    {
        public SchedulesController(IAsyncDocumentSession dbSession, ILogger<SchedulesController> logger)
            : base(dbSession, logger)
        {
        }

        [HttpGet]
        public Task<Schedule> GetScheduleForEvent(string eventId)
        {
            using (DbSession.Advanced.DocumentStore.AggressivelyCacheFor(TimeSpan.FromDays(7)))
            { 
                return DbSession.Query<Schedule>()
                    .FirstOrDefaultAsync(s => s.EventId == eventId);
            }
        }

        [HttpGet]
        [Authorize(Roles = Roles.Admin)]
        public Task<List<Schedule>> GetAll()
        {
            return DbSession.Query<Schedule>()
                .Take(50)
                .ToListAsync();
        }

        [HttpPost]
        [Authorize(Roles = Roles.Admin)]
        public async Task<Schedule> Save(Schedule schedule)
        {
            // Grab the talks from the schedule with their room and hour so that we can save them.
            var talkIds = schedule.Timeslots
                .SelectMany(t => t.Items)
                .Select(i => i.TalkId)
                .Where(i => !string.IsNullOrEmpty(i));
            var talks = await DbSession.LoadWithoutNulls<Talk>(talkIds);

            // Assign the talk hour and room.
            foreach (var talk in talks)
            {
                var timeslot = schedule.Timeslots.FirstOrDefault(t => t.Items.Any(i => i.TalkId == talk.Id));
                if (timeslot != null)
                {
                    var item = timeslot.Items.FirstOrDefault(i => i.TalkId == talk.Id);
                    if (item != null)
                    {
                        talk.Hour = timeslot.Start;
                        talk.Room = item.Room;
                    }
                }
            }

            // Store the schedule.
            await DbSession.StoreAsync(schedule);
            return schedule;
        }
    }
}