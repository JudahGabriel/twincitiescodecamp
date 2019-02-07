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
    }
}