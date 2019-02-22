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
                AuthorEmail = AuthorEmail,
                AuthorBio = AuthorBio,
                AuthorGitHub = AuthorGitHub,
                AuthorTwitter = AuthorTwitter,
                AuthorUrl = AuthorUrl,
                EventId = EventId,
                Hour = Hour,
                Id = null,
                PictureUrl = PictureUrl,
                Room = Room,
                Title = Title,
                Tags = Tags
            };
        }

        public void Update(TalkSubmission other)
        {
            this.Abstract = other.Abstract;
            this.Author = other.Author;
            this.AuthorBio = other.AuthorBio;
            this.AuthorGitHub = other.AuthorGitHub;
            this.AuthorTwitter = other.AuthorTwitter;
            this.AuthorUrl = other.AuthorUrl;
            this.PictureUrl = other.PictureUrl;
            this.Title = other.Title;
            this.Tags = other.Tags;
        }
    }
}