using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using TwinCitiesCodeCamp.Models;
using Raven.Client;
using Raven.Client.Linq;

namespace TwinCitiesCodeCamp.Controllers
{
    [RoutePrefix("api/events")]
    public class EventsController : RavenApiController
    {
        [Route("get")]
        public Task<Event> Get(string eventId)
        {
            return DbSession.LoadAsync<Event>(eventId);
        }

        [Route("mostrecent")]
        [HttpGet]
        public Task<Event> MostRecent()
        {
            return DbSession
                .Query<Event>()
                .OrderByDescending(e => e.DateTime)
                .FirstOrDefaultAsync();
        }

        [Route("getall")]
        public Task<IList<Event>> GetAll(bool descending)
        {
            IRavenQueryable<Event> query = DbSession.Query<Event>();

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

        [Route("save")]
        [Authorize(Roles = "Admin")]
        public async Task<Event> Save(Event ev)
        {
            var existingEvent = await DbSession.LoadAsync<Event>(ev.Id);
            existingEvent.CopyFrom(ev);
            return existingEvent;
        }
    }
}
