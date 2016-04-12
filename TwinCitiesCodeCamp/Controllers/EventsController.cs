using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using TwinCitiesCodeCamp.Models;
using Raven.Client;

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
        public Task<IList<Event>> GetAll()
        {
            return DbSession
                .Query<Event>()
                .OrderBy(e => e.Number)
                .ToListAsync();
        }
    }
}
