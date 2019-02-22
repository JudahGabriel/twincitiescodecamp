using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Raven.Client.Documents;
using Raven.Client.Documents.Session;
using System;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
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
        [Authorize(Roles = Roles.Admin)]
        public async Task<ActionResult> GetTalkSubmissionsCsv()
        {
            var dbUrl = this.DbSession.Advanced.DocumentStore.Urls.First();
            var dbName = ((DocumentStore)this.DbSession.Advanced.DocumentStore).Database;
            var entityName = this.DbSession.Advanced.DocumentStore.Conventions.GetCollectionName(typeof(TalkSubmission));
            var url = $"{dbUrl}/databases/{dbName}/streams/query/Raven/DocumentsByEntityName?format=excel&download=true&query=Tag%3A{entityName}";

            using (var webClient = new WebClient())
            {
                var bytes = await webClient.DownloadDataTaskAsync(new Uri(url));
                return File(bytes, "text/csv", $"tccc-talk-submissions-{DateTime.UtcNow.ToShortDateString()}.csv");
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
            // See if we did this before.
            if (profilePictures.TryGetValue(talkId, out var picUrl))
            {
                return Redirect(picUrl);
            }

            // Load the talk. If we don't have a talk or picture, use the "unknown speaker" image.
            var talk = await DbSession.LoadNotNull<Talk>(talkId);
            if (talk == null || string.IsNullOrEmpty(talk.PictureUrl))
            {
                return UnknownSpeaker();
            }

            // Is the picture URL on a Code Camp origin? If so, use that.
            if (talk.PictureUrl.IndexOf("twincitiescodecamp.com", StringComparison.InvariantCultureIgnoreCase) != -1 ||
                talk.PictureUrl.StartsWith("/content/images", StringComparison.InvariantCultureIgnoreCase) ||
                talk.PictureUrl.IndexOf("bitshuvafiles01.com", StringComparison.InvariantCulture) != -1)
            {
                return Redirect(picUrl);
            }

            // Does the image allow cross origin? If so, return that.
            using (var httpClient = new HttpClient())
            {
                // Do we have a "Access-Control-Allow-Origin: *" header? If so, use that image.
                var imageResult = await httpClient.GetAsync(talk.PictureUrl);
                if (!imageResult.IsSuccessStatusCode)
                {
                    return UnknownSpeaker();
                }

                if (imageResult.Headers.TryGetValues("Access-Control-Allow-Origin", out var corsHeaders) && corsHeaders.Any(h => h == "*"))
                {
                    profilePictures.TryAdd(talkId, talk.PictureUrl);
                    return Redirect(talk.PictureUrl);
                }

                // The image isn't CORS-enabled. Stream it back to the client.
                var imageBytes = await imageResult.Content.ReadAsByteArrayAsync();
                var fileName = talkId.Replace('/', '-') + ".jpg";
                try
                {
                    System.IO.File.WriteAllBytes(Server.MapPath($"~/App_Data/{fileName}"), imageBytes);
                    var urlPath = $"/files/GetTempProfilePic?talkId={talkId}";
                    profilePictures.TryAdd(talkId, urlPath);
                    return Redirect(urlPath);
                }
                catch (IOException)
                {
                    return UnknownSpeaker();
                }
            }
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