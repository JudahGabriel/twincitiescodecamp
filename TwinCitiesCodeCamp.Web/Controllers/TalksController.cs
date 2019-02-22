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

            // Make sure the event is not closed for talks.
            if (!mostRecentEvent.IsAcceptingTalkSubmissions)
            {
                throw new InvalidOperationException("This event is not currently accepting talk submissions");
            }
            if (mostRecentEvent.NoTalkSubmissionsAfter.HasValue && DateTime.UtcNow > mostRecentEvent.NoTalkSubmissionsAfter)
            {
                throw new InvalidOperationException("This event is closed for new talks");
            }

            talk.Id = null;
            talk.AuthorEmail = User.Identity.Name;
            talk.SubmissionDate = DateTime.UtcNow;
            talk.SubmittedByUserId = "ApplicationUsers/" + User.Identity.Name;
            talk.EventId = mostRecentEvent.Id;
            await DbSession.StoreAsync(talk);
            return talk;
        }

        [Route("update")]
        [HttpPost]
        [Authorize]
        public async Task<TalkSubmission> Update(TalkSubmission talk)
        {
            // Authorize: you can only update your talks.
            var existingTalk = await DbSession.LoadRequiredAsync<TalkSubmission>(talk.Id);
            var currentUser = await this.GetUserOrThrow();
            var isTalkOwner = string.Equals(currentUser.Id, existingTalk.SubmittedByUserId, StringComparison.InvariantCultureIgnoreCase);
            var isAdmin = currentUser.Roles.Contains(Roles.Admin);
            if (!isTalkOwner && !isAdmin)
            {
                throw new UnauthorizedAccessException();
            }

            existingTalk.Update(talk);
            return existingTalk;
        }

        [HttpGet]
        [Authorize(Roles = Roles.Admin)]
        public Task<List<TalkSubmission>> GetSubmissions(string eventId)
        {
            return DbSession.Query<TalkSubmission>()
                .Where(s => s.EventId == eventId)
                .ToListAsync();
        }

        [Route("getSubmission")]
        [HttpGet]
        public async Task<TalkSubmission> GetSubmission(string talkSubmissionId)
        {
            if (!talkSubmissionId.StartsWith("talksubmissions/", StringComparison.InvariantCultureIgnoreCase))
            {
                throw new ArgumentException("Only talk submissions can be loaded.");
            }

            // Authorize: we must be an amdin, or alternately, the talk must be for the most recent event.
            var currentEvent = await DbSession.Query<Event>()
                .OrderByDescending(e => e.Number)
                .FirstAsync();
            var submission = await DbSession.LoadRequiredAsync<TalkSubmission>(talkSubmissionId);
            var currentUser = await this.GetUser();
            var isAdmin = currentUser.Exists(u => u.Roles.Contains(Roles.Admin));
            var isSubmissionForCurrentEvent = string.Equals(submission.EventId, currentEvent.Id, StringComparison.InvariantCultureIgnoreCase);
            if (!isAdmin && !isSubmissionForCurrentEvent)
            {
                throw new UnauthorizedAccessException("You're not authorized to view this submission");
            }

            return submission;
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

        [HttpGet]
        public Task<IList<string>> SearchTags(string search)
        {
            return DbSession.Query<Talks_Tags.Result, Talks_Tags>()
                .Search(i => i.Name, search + "*", 1, SearchOptions.Guess)
                .Take(10)
                .Select(i => i.Name)
                .ToListAsync();
        }
    }
}
