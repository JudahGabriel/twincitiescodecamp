using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TwinCitiesCodeCamp.Models
{
    public class HomeViewModel
    {
        public bool IsSignedIn { get; set; }
        public string UserName { get; set; }
        public string UserId { get; set; }
        public bool IsUserAdmin { get; set; }
    }
}