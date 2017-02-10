using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using TwinCitiesCodeCamp.Models;
using TwinCitiesCodeCamp.Common;
using Raven.Client;
using Optional;

namespace TwinCitiesCodeCamp.Controllers
{
    [RoutePrefix("api/talks")]
    public class TalksController : RavenApiController
    {
        [Route("get")]
        public Task<Talk> Get(string talkId)
        {
            return DbSession.LoadAsync<Talk>(talkId);
        }

        [Route("getTalksForEvent")]
        public Task<IList<Talk>> GetTalksForEvent(string eventId)
        {
            using (DbSession.Advanced.DocumentStore.AggressivelyCacheFor(TimeSpan.FromDays(7)))
            {
                return DbSession.Query<Talk>()
                    .Where(s => s.EventId == eventId)
                    .ToListAsync();
            }
        }

        [Route("submit")]
        [HttpPost]
        [Authorize]
        public async Task<TalkSubmission> Submit(TalkSubmission talk)
        {
            talk.Id = null;
            talk.SubmissionDate = DateTime.UtcNow;
            talk.SubmittedByUserId = "ApplicationUsers/" + User.Identity.Name;
            await DbSession.StoreAsync(talk);
            return talk;
        }

        [Route("getSubmissions")]
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public Task<IList<TalkSubmission>> GetSubmissions()
        {
            return DbSession.Query<TalkSubmission>()
                .ToListAsync();
        }

        [Route("getMySubmissions")]
        [HttpGet]
        [Authorize]
        public async Task<IList<TalkSubmission>> GetMySubmissions()
        {
            var userId = "ApplicationUsers/" + User.Identity.Name;
            var user = await DbSession.LoadAsync<ApplicationUser>(userId);
            if (user == null)
            {
                return new List<TalkSubmission>(0);
            }

            return await DbSession.Query<TalkSubmission>()
                .Where(t => t.SubmittedByUserId == userId)
                .ToListAsync();
        }
    }
}
