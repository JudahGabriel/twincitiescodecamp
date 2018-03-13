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
    }
}