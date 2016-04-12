using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using TwinCitiesCodeCamp.Data;
using TwinCitiesCodeCamp.Models;

namespace TwinCitiesCodeCamp.Controllers
{
    public class LegacyController : Controller
    {
        [Route("sessions/{seasonYear}")]
        public ActionResult Sessions(string seasonYear)
        {
            using (var session = RavenContext.Db.OpenSession())
            {
                var seasonYearSpaces = seasonYear
                    .Replace("Fall", "Fall ")
                    .Replace("Spring", "Spring ");
                var ev = session.Query<Event>().FirstOrDefault(e => e.SeasonYear == seasonYearSpaces);
                if (ev == null)
                {
                    throw new ArgumentException("Couldn't find event for " + seasonYearSpaces);
                }

                object model = ev.Id;
                return View(model);
            }
        }
    }
}