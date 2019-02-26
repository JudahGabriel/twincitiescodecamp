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
        private static ConcurrentDictionary<string, string> profilePictures = new ConcurrentDictionary<string, string>();

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> GetTalkSubmissionsCsv()
        {
            var dbUrl = this.DbSession.Advanced.DocumentStore.Url;
            var dbName = ((DocumentStore)this.DbSession.Advanced.DocumentStore).DefaultDatabase;
            var entityName = nameof(Talk) + "s";
            var url = $"{dbUrl}/databases/{dbName}/streams/query/Talks/ByStatus?query=Status%3A%20%22Pending%22&format=excel&download=true";
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
            string picUrl;
            if (profilePictures.TryGetValue(talkId, out picUrl))
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
                return Redirect(talk.PictureUrl);
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

                IEnumerable<string> corsHeaders;
                if (imageResult.Headers.TryGetValues("Access-Control-Allow-Origin", out corsHeaders) && corsHeaders.Any(h => h == "*"))
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