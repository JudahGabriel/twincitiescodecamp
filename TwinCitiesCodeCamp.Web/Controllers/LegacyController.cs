using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Raven.Client.Documents.Session;
using System;
using System.Linq;
using System.Threading.Tasks;
using TwinCitiesCodeCamp.Models;

namespace TwinCitiesCodeCamp.Controllers
{
    public class LegacyController : RavenController
    {
        public LegacyController(IAsyncDocumentSession dbSession, ILogger<LegacyController> logger)
            : base(dbSession, logger)
        {
        }

        [Route("sessions/{seasonYear}")]
        public async Task<ActionResult> Sessions(string seasonYear)
        {
            var seasonYearSpaces = seasonYear
                .Replace("Fall", "Fall ")
                .Replace("Spring", "Spring ");
            var ev = await DbSession.Query<Event>().FirstOrDefaultAsync(e => e.SeasonYear == seasonYearSpaces);
            if (ev == null)
            {
                throw new ArgumentException("Couldn't find event for " + seasonYearSpaces);
            }

            object model = ev.Id;
            return View(model);
        }

        [Route("schedule/{seasonYear}")]
        public async Task<ActionResult> Schedule(string seasonYear)
        {
            var seasonYearSpaces = seasonYear
                .Replace("Fall", "Fall ")
                .Replace("Spring", "Spring ");
            var ev = await DbSession.Query<Event>().FirstOrDefaultAsync(e => e.SeasonYear == seasonYearSpaces);
            if (ev == null)
            {
                throw new ArgumentException("Couldn't find event for " + seasonYearSpaces);
            }

            object model = ev.Id;
            return View(model);
        }
    }
}