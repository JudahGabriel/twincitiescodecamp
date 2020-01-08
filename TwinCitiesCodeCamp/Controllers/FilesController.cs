using CsvHelper;
using Raven.Client;
using Raven.Client.Document;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using TwinCitiesCodeCamp.Common;
using TwinCitiesCodeCamp.Models;

namespace TwinCitiesCodeCamp.Controllers
{
    public class FilesController : RavenController
    {
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> GetTalkSubmissionsCsv()
        {
            var pendingTalks = await DbSession.Query<Talk>()
                .Where(t => t.Status == TalkApproval.Pending)
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
        /// Gets a CORS-safe picture url for a talk. If the talk has a PictureUrl pointing to a CORS-enabled image, that image is used.
        /// If the image points to a non-CORS enabled image, that image is downloaded on the server and streamed back to the user.
        /// </summary>
        /// <remarks>This is ugly and does too many things. It's temporary until we move to Raven 4, at which point we'll just use attachments.</remarks>
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

        public ActionResult GetTempProfilePic(string talkId)
        {
            var fileName = talkId.Replace('/', '-') + ".jpg";
            return File(Server.MapPath($"~/App_Data/{fileName}"), "image/jpg");
        }

        public ActionResult UnknownSpeaker()
        {
            return Redirect("/content/images/unknown-speaker.jpg");
        }
    }
}