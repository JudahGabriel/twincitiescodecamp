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
    }
}