using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Raven.Client.Documents;
using Raven.Client.Documents.Session;
using System;
using System.Collections.Concurrent;
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
        public async Task<ActionResult> GetTalkSubmissionsCsv()
        {
            // TODO: implement this
            throw new NotImplementedException();
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