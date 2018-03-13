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
            var mostRecentEvent = await DbSession
                .Query<Event>()
                .OrderByDescending(e => e.DateTime)
                .FirstAsync();

            talk.Id = null;
            talk.AuthorEmail = User.Identity.Name;
            talk.SubmissionDate = DateTime.UtcNow;
            talk.SubmittedByUserId = "ApplicationUsers/" + User.Identity.Name;
            talk.EventId = mostRecentEvent.Id;
            await DbSession.StoreAsync(talk);
            return talk;
        }

        [Route("getSubmissions")]
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public Task<IList<TalkSubmission>> GetSubmissions(string eventId)
        {
            return DbSession.Query<TalkSubmission>()
                .Where(s => s.EventId == eventId)
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

        [Route("approve")]
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<TalkSubmission> Approve(string talkSubmissionId)
        {
            var talkSubmission = await DbSession.LoadNotNull<TalkSubmission>(talkSubmissionId);
            talkSubmission.Status = TalkApproval.Approved;
            var talk = talkSubmission.ToTalk();
            await DbSession.StoreAsync(talk);
            return talkSubmission;
        }

        [Route("reject")]
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<TalkSubmission> Reject(string talkSubmissionId)
        {
            var talkSubmission = await DbSession.LoadNotNull<TalkSubmission>(talkSubmissionId);
            talkSubmission.Status = TalkApproval.Rejected;
            return talkSubmission;
        }
    }
}
