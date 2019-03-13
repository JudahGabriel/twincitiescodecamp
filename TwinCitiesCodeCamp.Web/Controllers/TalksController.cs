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
using TwinCitiesCodeCamp.Data;

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
                    .Where(s => s.EventId == eventId && s.Status == TalkApproval.Approved)
                    .OrderBy(s => s.Hour)
                    .ThenBy(s => s.Title)
                    .ToListAsync();
            }
        }

        [HttpGet]
        public async Task<List<Talk>> GetTalksForMostRecentEvent()
        {
            var mostRecentEventId = await DbSession
                .Query<Event>()
                .OrderByDescending(e => e.DateTime)
                .Select(e => e.Id)
                .FirstAsync();
            var talks = await DbSession.Query<Talk>()
                .Where(t => t.EventId == mostRecentEventId && t.Status == TalkApproval.Approved)
                .ToListAsync();
            return talks;
        }

        [HttpPost]
        [Authorize]
        public async Task<Talk> Submit(Talk talk)
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
                throw new InvalidOperationException("Call for speakers has ended");
            }

            talk.Id = null;
            talk.AuthorEmail = User.Identity.Name;
            talk.SubmissionDate = DateTime.UtcNow;
            talk.SubmittedByUserId = "AppUsers/" + User.Identity.Name;
            talk.EventId = mostRecentEvent.Id;
            talk.Status = TalkApproval.Pending;
            await DbSession.StoreAsync(talk);
            return talk;
        }

        [HttpPost]
        [Authorize]
        public async Task<Talk> Update(Talk talk)
        {
            // Authorize: you can only update your talks.
            var existingTalk = await DbSession.LoadRequiredAsync<Talk>(talk.Id);
            var currentUser = await this.GetUserOrThrow();
            var isTalkOwner = string.Equals(currentUser.Id, existingTalk.SubmittedByUserId, StringComparison.InvariantCultureIgnoreCase);
            var isAdmin = currentUser.IsAdmin();
            if (!isTalkOwner && !isAdmin)
            {
                throw new UnauthorizedAccessException();
            }

            // Authorize: you can only update talks that are in pending state.
            if (existingTalk.Status != TalkApproval.Pending)
            {
                throw new UnauthorizedAccessException();
            }

            // You can't update a talk if its event has already taken place.
            var codeCampEvent = await DbSession.LoadRequiredAsync<Event>(talk.EventId);
            if (codeCampEvent.DateTime < DateTime.UtcNow)
            {
                throw new InvalidOperationException("Can't update talks for code camps that have already taken place.");
            }

            existingTalk.Update(talk);
            return existingTalk;
        }

        [Route("getSubmission")]
        [HttpGet]
        public async Task<Talk> GetSubmission(string talkSubmissionId)
        {
            if (!talkSubmissionId.StartsWith("talks/", StringComparison.InvariantCultureIgnoreCase))
            {
                throw new ArgumentException("Only talks can be loaded.");
            }

            // Authorize: we must be an amdin, or alternately, the talk must be for the most recent event.
            var currentEvent = await DbSession.Query<Event>()
                .OrderByDescending(e => e.Number)
                .FirstAsync();
            var submission = await DbSession.LoadRequiredAsync<Talk>(talkSubmissionId);
            var currentUser = await this.GetUser();
            var isAdmin = currentUser.Exists(u => u.IsAdmin());
            var isSubmissionForCurrentEvent = string.Equals(submission.EventId, currentEvent.Id, StringComparison.InvariantCultureIgnoreCase);
            if (!isAdmin && !isSubmissionForCurrentEvent)
            {
                throw new UnauthorizedAccessException("You're not authorized to view this submission");
            }

            return submission;
        }

        [Route("getSubmissions")]
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public Task<List<Talk>> GetSubmissions(string eventId)
        {
            return DbSession.Query<Talk>()
                .Where(s => s.EventId == eventId)
                .ToListAsync();
        }

        [Route("getMySubmissions")]
        [HttpGet]
        [Authorize]
        public async Task<IList<Talk>> GetMySubmissions()
        {
            var userId = this.GetUserId().ValueOrDefault();
            
            return await DbSession.Query<Talk>()
                .Where(t => t.SubmittedByUserId == userId)
                .ToListAsync();
        }

        [Route("approve")]
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<Talk> Approve(string talkSubmissionId)
        {
            var talkSubmission = await DbSession.LoadRequiredAsync<Talk>(talkSubmissionId);
            talkSubmission.Status = TalkApproval.Approved;
            return talkSubmission;
        }

        [Route("reject")]
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<Talk> Reject(string talkSubmissionId)
        {
            var talkSubmission = await DbSession.LoadRequiredAsync<Talk>(talkSubmissionId);
            talkSubmission.Status = TalkApproval.Rejected;
            return talkSubmission;
        }

        [Route("searchTags")]
        [HttpGet]
        public Task<List<string>> SearchTags(string search)
        {
            return DbSession.Query<Talks_Tags.Result, Talks_Tags>()
                .Search(i => i.Name, search + "*", 1, SearchOptions.Guess)
                .Select(i => i.Name)
                .Take(10)
                .ToListAsync();
        }
    }
}
