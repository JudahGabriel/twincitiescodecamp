using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Optional.Unsafe;
using Raven.Client.Documents.Session;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TwinCitiesCodeCamp.Models;

namespace TwinCitiesCodeCamp.Controllers
{
    [RequireHttps]
    [Route("[controller]/[action]")]
    public class HomeController : RavenController
    {
        public HomeController(IAsyncDocumentSession dbSession, ILogger<HomeController> logger)
            : base(dbSession, logger)
        {
        }

        public async Task<ActionResult> Index()
        {
            var user = await this.GetUser();
            var vm = new HomeViewModel
            {
                UserName = User.Identity.Name,
                IsSignedIn = User.Identity.IsAuthenticated,
                UserId = user.Map(u => u.Id).ValueOrDefault(),
                IsUserAdmin = user.Exists(u => u.Roles.Contains(Roles.Admin))
            };

            return View(vm);
        }
    }
}