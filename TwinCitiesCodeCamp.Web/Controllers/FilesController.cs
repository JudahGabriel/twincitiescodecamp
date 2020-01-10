using CsvHelper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Raven.Client.Documents;
using Raven.Client.Documents.Session;
using System;
using System.Collections.Concurrent;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using TwinCitiesCodeCamp.Common;
using TwinCitiesCodeCamp.Models;

namespace TwinCitiesCodeCamp.Controllers
{
    [Route("api/[controller]/[action]")]
    public class FilesController : RavenController
    {
        private static ConcurrentDictionary<string, string> profilePictures = new ConcurrentDictionary<string, string>();

        public FilesController(IAsyncDocumentSession dbSession, ILogger<FilesController> logger)
            : base(dbSession, logger)
        {
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> GetTalkSubmissionsCsv(string eventId)
        {
            var pendingTalks = await DbSession.Query<Talk>()
                .Where(t => t.EventId == eventId)
                .Skip(0)
                .Take(1000) // domain-limited, generally will have under 100
                .ToListAsync();

            using (var stream = new MemoryStream())
            using (var writer = new StreamWriter(stream))
            using (var csv = new CsvWriter(writer))
            {
                csv.WriteRecords(pendingTalks);
                return File(stream.ToArray(), "text/csv", $"tccc-talk-submissions-{DateTime.UtcNow.ToShortDateString()}.csv");
            }
        }

        /// <summary>
        /// Gets the speaker image for a talk.
        /// </summary>
        /// <param name="talkId"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<ActionResult> GetTalkProfileImage(string talkId)
        {
            var talk = await DbSession.LoadAsync<Talk>(talkId);
            if (talk != null && !string.IsNullOrEmpty(talk.PictureUrl))
            {
                return Redirect(talk.PictureUrl);
            }

            return UnknownSpeaker();
        }

        public ActionResult UnknownSpeaker()
        {
            return Redirect("/content/images/unknown-speaker.jpg");
        }
    }
}