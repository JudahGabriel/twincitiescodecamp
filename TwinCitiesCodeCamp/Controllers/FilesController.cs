using Raven.Client.Document;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using TwinCitiesCodeCamp.Models;

namespace TwinCitiesCodeCamp.Controllers
{
    public class FilesController : RavenController
    {
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> GetTalkSubmissionsCsv()
        {
            var dbUrl = this.DbSession.Advanced.DocumentStore.Url;
            var dbName = ((DocumentStore)this.DbSession.Advanced.DocumentStore).DefaultDatabase;
            var entityName = nameof(TalkSubmission) + "s";
            var url = $"{dbUrl}/databases/{dbName}/streams/query/Raven/DocumentsByEntityName?format=excel&download=true&query=Tag%3A{entityName}";

            using (var webClient = new WebClient())
            {
                var bytes = await webClient.DownloadDataTaskAsync(new Uri(url));
                return File(bytes, "text/csv", $"tccc-talk-submissions-{DateTime.UtcNow.ToShortDateString()}.csv");
            }
        }
    }
}