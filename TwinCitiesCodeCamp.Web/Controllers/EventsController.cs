using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Raven.Client.Documents;
using Raven.Client.Documents.Linq;
using Raven.Client.Documents.Session;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TwinCitiesCodeCamp.Models;

namespace TwinCitiesCodeCamp.Controllers
{
    [Route("api/[controller]/[action]")]
    public class EventsController : RavenController
    {
        public EventsController(IAsyncDocumentSession dbSession, ILogger<EventsController> logger)
            : base(dbSession, logger)
        {
        }

        [HttpGet]
        public Task<Event> Get(string eventId)
        {
            return DbSession.LoadAsync<Event>(eventId);
        }

        [HttpGet]
        public Task<Event> MostRecent()
        {
            return DbSession
                .Query<Event>()
                .OrderByDescending(e => e.DateTime)
                .FirstOrDefaultAsync();
        }

        [HttpGet]
        public Task<List<Event>> GetAll(bool descending)
        {
            var query = DbSession.Query<Event>();

            if (descending)
            {
                query = query.OrderByDescending(e => e.Number);
            }
            else
            {
                query = query.OrderBy(e => e.Number);
            }

            return query.ToListAsync();
        }

        [HttpPost]
        [Authorize(Roles = Roles.Admin)]
        public async Task<Event> Save(Event ev)
        {
            if (ev.Number == 0)
            {
                throw new ArgumentOutOfRangeException("Event must have a non-zero event number");
            }

            var isNewEvent = string.IsNullOrEmpty(ev.Id);
            if (isNewEvent)
            {
                var id = $"events/{ev.Number}";
                await DbSession.StoreAsync(ev, id);
                return ev;
            }
            
            var existingEvent = await DbSession.LoadAsync<Event>(ev.Id);
            existingEvent.CopyFrom(ev);
            return existingEvent;
        }
    }
}
