using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using TwinCitiesCodeCamp.Models;

namespace TwinCitiesCodeCamp.Controllers
{
    [RequireHttps]
    public class HomeController : RavenController
    {
        public async Task<ActionResult> Index()
        {
            var user = default(ApplicationUser);
            if (!string.IsNullOrEmpty(User.Identity.Name))
            {
                user = await DbSession.LoadAsync<ApplicationUser>("ApplicationUsers/" + User.Identity.Name);
            }

            var vm = new HomeViewModel
            {
                UserName = User.Identity.Name,
                IsSignedIn = User.Identity.IsAuthenticated,
                UserId = user?.Id,
                IsUserAdmin = (user?.Roles?.Contains("Admin")).GetValueOrDefault()
            };

            return View(vm);
        }
    }
}