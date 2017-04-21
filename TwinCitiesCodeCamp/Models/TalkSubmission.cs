using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TwinCitiesCodeCamp.Models
{
    public class TalkSubmission : Talk
    {
        public DateTime SubmissionDate { get; set; }
        public string SubmittedByUserId { get; set; }
        public TalkApproval Status { get; set; }

        public Talk ToTalk()
        {
            return new Talk
            {
                Abstract = Abstract,
                Author = Author,
                AuthorBio = AuthorBio,
                AuthorGitHub = AuthorGitHub,
                AuthorTwitter = AuthorTwitter,
                AuthorUrl = AuthorUrl,
                EventId = EventId,
                Hour = Hour,
                Id = null,
                PictureUrl = PictureUrl,
                Room = Room,
                Title = Title
            };
        }
    }
}