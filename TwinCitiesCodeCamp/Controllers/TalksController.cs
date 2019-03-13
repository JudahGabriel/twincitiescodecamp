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
using TwinCitiesCodeCamp.Data;

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

        [Route("getTalksForMostRecentEvent")]
        public async Task<IList<Talk>> GetTalksForMostRecentEvent()
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
               
        [Route("getTalksForEvent")]
        public Task<IList<Talk>> GetTalksForEvent(string eventId)
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

        [Route("submit")]
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

        [Route("update")]
        [HttpPost]
        [Authorize]
        public async Task<Talk> Update(Talk talk)
        {
            // Authorize: you can only update your talks.
            var existingTalk = await DbSession.LoadNotNull<Talk>(talk.Id);
            var currentUser = await this.GetCurrentUser();
            var isTalkOwner = currentUser.Exists(u => string.Equals(u.Id, existingTalk.SubmittedByUserId, StringComparison.InvariantCultureIgnoreCase));
            var isAdmin = currentUser.Exists(u => u.IsAdmin());
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
            var codeCampEvent = await DbSession.LoadNotNull<Event>(talk.EventId);
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
            var submission = await DbSession.LoadNotNull<Talk>(talkSubmissionId);
            var currentUser = await this.GetCurrentUser();
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
        public Task<IList<Talk>> GetSubmissions(string eventId)
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
            var userId = "ApplicationUsers/" + User.Identity.Name;
            var user = await DbSession.LoadAsync<ApplicationUser>(userId);
            if (user == null)
            {
                return new List<Talk>(0);
            }

            return await DbSession.Query<Talk>()
                .Where(t => t.SubmittedByUserId == userId)
                .ToListAsync();
        }

        [Route("approve")]
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<Talk> Approve(string talkSubmissionId)
        {
            var talkSubmission = await DbSession.LoadNotNull<Talk>(talkSubmissionId);
            talkSubmission.Status = TalkApproval.Approved;
            return talkSubmission;
        }

        [Route("reject")]
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<Talk> Reject(string talkSubmissionId)
        {
            var talkSubmission = await DbSession.LoadNotNull<Talk>(talkSubmissionId);
            talkSubmission.Status = TalkApproval.Rejected;
            return talkSubmission;
        }

        [Route("searchTags")]
        [HttpGet]
        public Task<IList<string>> SearchTags(string search)
        {
            return DbSession.Query<Talks_Tags.Result, Talks_Tags>()
                .Search(i => i.Name, search + "*", 1, SearchOptions.Guess, EscapeQueryOptions.AllowPostfixWildcard)
                .Select(i => i.Name)
                .Take(10)
                .ToListAsync();
        }
    }
}
