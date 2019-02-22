using Raven.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Controllers;
using Microsoft.AspNet.Identity.Owin;
using TwinCitiesCodeCamp.Data;
using TwinCitiesCodeCamp.Models;
using Optional;

namespace TwinCitiesCodeCamp.Controllers
{
    /// <summary>
    /// Base class for API controllers that use the database.
    /// </summary>
    public abstract class RavenApiController : ApiController
    {
        public async override Task<HttpResponseMessage> ExecuteAsync(HttpControllerContext controllerContext, CancellationToken cancellationToken)
        {
            using (DbSession)
            {
                try
                {
                    var result = await base.ExecuteAsync(controllerContext, cancellationToken);
                    await DbSession.SaveChangesAsync();

                    return result;
                }
                catch (Exception error)
                {
                    Console.WriteLine(error.Message);
                    throw;
                }
            }
        }

        protected async Task<Option<ApplicationUser>> GetCurrentUser()
        {
            if (string.IsNullOrEmpty(User.Identity.Name))
            {
                return Option.None<ApplicationUser>();
            }

            var userId = "ApplicationUsers/" + User.Identity.Name;
            var user = await DbSession.LoadAsync<ApplicationUser>(userId);
            return user.SomeNotNull();
        }

        //added to allow getting db data was throwing exception
        //wasn't sure the proper way to do this so will need to be redone.
        protected override void Initialize(HttpControllerContext controllerContext)
        {
            base.Initialize(controllerContext);
            DbSession = controllerContext.Request.GetOwinContext().Get<IAsyncDocumentSession>();
        }

        public IAsyncDocumentSession DbSession { get; private set; }
    }
}
