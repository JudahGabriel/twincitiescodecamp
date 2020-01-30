using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TwinCitiesCodeCamp.Models
{
    public class PasswordReset
    {
        public DateTimeOffset Created { get; set; }
        public string Code { get; set; }
        public string UserId { get; set; }
        public string Url { get; set; }
    }
}