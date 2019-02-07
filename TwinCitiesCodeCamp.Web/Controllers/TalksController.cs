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
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Raven.Client.Documents.Session;
using Microsoft.Extensions.Logging;
using Raven.Client.Documents;
using Optional.Unsafe;

namespace TwinCitiesCodeCamp.Controllers
{
    [Route("api/[controller]/[action]")]
    public class TalksController : RavenController
    {
        public TalksController(IAsyncDocumentSession dbSession, ILogger<TalksController> logger)
            : base(dbSession, logger)
        {
        }

        [HttpGet]
        public Task<Talk> Get(string talkId)
        {
            return DbSession.LoadAsync<Talk>(talkId);
        }

        [HttpGet]
        public Task<List<Talk>> GetTalksForEvent(string eventId)
        {
            using (DbSession.Advanced.DocumentStore.AggressivelyCacheFor(TimeSpan.FromDays(7)))
            {
                return DbSession.Query<Talk>()
                    .Where(s => s.EventId == eventId)
                    .OrderBy(s => s.Hour)
                    .ThenBy(s => s.Title)
                    .ToListAsync();
            }
        }

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

        [HttpGet]
        [Authorize(Roles = Roles.Admin)]
        public Task<List<TalkSubmission>> GetSubmissions(string eventId)
        {
            return DbSession.Query<TalkSubmission>()
                .Where(s => s.EventId == eventId)
                .ToListAsync();
        }

        [HttpGet]
        [Authorize]
        public async Task<IList<TalkSubmission>> GetMySubmissions()
        {
            var userId = this.GetUserId();
            if (!userId.HasValue)
            {
                return new List<TalkSubmission>(0);
            }

            var userIdVal = userId.ValueOrDefault();
            return await DbSession.Query<TalkSubmission>()
                .Where(t => t.SubmittedByUserId == userIdVal)
                .ToListAsync();
        }

        [HttpPost]
        [Authorize(Roles = Roles.Admin)]
        public async Task<TalkSubmission> Approve(string talkSubmissionId)
        {
            var talkSubmission = await DbSession.LoadRequiredAsync<TalkSubmission>(talkSubmissionId);
            talkSubmission.Status = TalkApproval.Approved;
            var talk = talkSubmission.ToTalk();
            await DbSession.StoreAsync(talk);
            return talkSubmission;
        }

        [HttpPost]
        [Authorize(Roles = Roles.Admin)]
        public async Task<TalkSubmission> Reject(string talkSubmissionId)
        {
            var talkSubmission = await DbSession.LoadRequiredAsync<TalkSubmission>(talkSubmissionId);
            talkSubmission.Status = TalkApproval.Rejected;
            return talkSubmission;
        }
    }
}
