using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TwinCitiesCodeCamp.Models
{
    public class Talk
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Abstract { get; set; }
        public string Author { get; set; }
        public string AuthorBio { get; set; }
        public string AuthorEmail { get; set; }
        public string AuthorUrl { get; set; }
        public string AuthorTwitter { get; set; }
        public string AuthorGitHub { get; set; }
        public string Room { get; set; }
        public double Hour { get; set; }
        public string PictureUrl { get; set; }
        public string EventId { get; set; }
        public string SubmittedByUserId { get; set; }
        public List<string> Tags { get; set; } = new List<string>();
        public DateTime SubmissionDate { get; set; }
        public TalkApproval Status { get; set; }

        public void Update(Talk other)
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
            this.Status = other.Status;
        }
    }
}