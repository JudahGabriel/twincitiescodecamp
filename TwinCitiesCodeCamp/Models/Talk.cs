using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TwinCitiesCodeCamp.Models
{
    public class Talk
    {
        public string Title { get; set; }
        public string Abstract { get; set; }
        public string Author { get; set; }
        public string AuthorBio { get; set; }
        public string AuthorTwitter { get; set; }
        public string Room { get; set; }
    }
}