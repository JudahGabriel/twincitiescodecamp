using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using TwinCitiesCodeCamp.Models;
using Raven.Client;
using Microsoft.AspNetCore.Mvc;
using Raven.Client.Documents.Session;
using Microsoft.Extensions.Logging;
using Raven.Client.Documents;
using Microsoft.AspNetCore.Authorization;

namespace TwinCitiesCodeCamp.Controllers
{
    [Route("api/[controller]/[action]")]
    public class SponsorsController : RavenController
    {
        public SponsorsController(IAsyncDocumentSession dbSession, ILogger<SponsorsController> logger)
            : base(dbSession, logger)
        {
        }

        [HttpGet]
        public Task<List<Sponsor>> GetSponsorsForEvent(string eventId)
        {
            return DbSession.Query<Sponsor>()
                .Where(s => s.EventId == eventId)
                .OrderBy(s => s.CreateDate)
                .ToListAsync();
        }

        [HttpPost]
        [Authorize(Roles = Roles.Admin)]
        public async Task<Sponsor> Save(Sponsor sponsor)
        {
            await DbSession.StoreAsync(sponsor);
            return sponsor;
        }

        [HttpPost]
        [Authorize(Roles = Roles.Admin)]
        public void Delete(string sponsorId)
        {
            if (!sponsorId.StartsWith("sponsors/", StringComparison.InvariantCultureIgnoreCase))
            {
                throw new InvalidOperationException("Invalid ID");
            }


            DbSession.Delete(sponsorId);
        }
    }
}
