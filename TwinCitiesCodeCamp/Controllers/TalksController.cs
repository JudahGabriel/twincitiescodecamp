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
    [RoutePrefix("api/talks")]
    public class TalksController : RavenApiController
    {
        [Route("get")]
        public Task<Talk> Get(string talkId)
        {
            return DbSession.LoadAsync<Talk>(talkId);
        }

        [Route("gettalksforevent")]
        public Task<IList<Talk>> GetTalksForEvent(string eventId)
        {
            using (DbSession.Advanced.DocumentStore.AggressivelyCacheFor(TimeSpan.FromDays(7)))
            {
                return DbSession.Query<Talk>()
                    .Where(s => s.EventId == eventId)
                    .ToListAsync();
            }
        }
    }
}
