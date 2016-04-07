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
    [RoutePrefix("api/sponsors")]
    public class SponsorsController : RavenApiController
    {
        [Route("getSponsorsForEvent")]
        public Task<IList<Sponsor>> GetSponsorsForEvent(string eventId)
        {
            return DbSession.Query<Sponsor>()
                .Where(s => s.EventId == eventId)
                .OrderBy(s => s.CreateDate)
                .ToListAsync();
        }
    }
}
