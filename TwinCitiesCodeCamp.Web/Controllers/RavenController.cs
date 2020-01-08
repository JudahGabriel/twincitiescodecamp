using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;
using Optional;
using Raven.Client.Documents.Session;
using Raven.StructuredLog;
using System;
using System.Linq;
using System.Threading.Tasks;
using TwinCitiesCodeCamp.Common;
using TwinCitiesCodeCamp.Models;

namespace TwinCitiesCodeCamp.Controllers
{
    /// <summary>
    /// Controller that saves changes on the RavenDB document session.
    /// </summary>
    [ApiController]
    public abstract class RavenController : Controller
    {
        protected RavenController(IAsyncDocumentSession dbSession, ILogger logger)
        {
            DbSession = dbSession ?? throw new ArgumentNullException(nameof(dbSession));
            Logger = logger ?? throw new ArgumentNullException(nameof(logger));

            // RavenDB best practice: during save, wait for the indexes to update.
            // This way, Post-Redirect-Get scenarios are covered, not affected by stale indexes.
            // For more info, see https://ravendb.net/docs/article-page/4.1/csharp/client-api/session/saving-changes
            DbSession.Advanced.WaitForIndexesAfterSaveChanges(timeout: TimeSpan.FromSeconds(3), throwOnTimeout: false);
        }

        /// <summary>
        /// Gets the RavenDB document session created for the current request. 
        /// Changes will be saved automatically when the action finishes executing without error.
        /// </summary>
        public IAsyncDocumentSession DbSession { get; private set; }

        /// <summary>
        /// The logger.
        /// </summary>
        public ILogger Logger { get; private set; }

        /// <summary>
        /// Executes the action. If no error occurred, any changes made in the RavenDB document session will be saved.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="next"></param>
        /// <returns></returns>
        public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var executedContext = await next.Invoke();
            var httpMethodOrNull = context?.HttpContext?.Request?.Method;
            if (executedContext.Exception != null)
            {
                using (Logger.BeginKeyValueScope("user", context?.HttpContext?.User?.Identity?.Name))
                using (Logger.BeginKeyValueScope("action", executedContext.ActionDescriptor?.DisplayName))
                using (Logger.BeginKeyValueScope("routeValues", string.Join("; ", executedContext.ActionDescriptor.RouteValues.Select(r => r.ToString()))))
                {
                    Logger.LogError(executedContext.Exception, executedContext.Exception.Message);
                }
            }
            else if (httpMethodOrNull != "GET" && DbSession.Advanced.HasChanges)
            {
                try
                {
                    await DbSession.SaveChangesAsync();
                }
                catch (Exception saveError)
                {
                    using (Logger.BeginKeyValueScope("user", context?.HttpContext?.User?.Identity?.Name))
                    using (Logger.BeginKeyValueScope("action", context?.ActionDescriptor?.DisplayName))
                    using (Logger.BeginKeyValueScope("changes", DbSession.Advanced.WhatChanged()))
                    {
                        Logger.LogError(saveError, $"Error saving changes for {next.Method?.Name}");
                    }
                }
            }
        }

        /// <summary>
        /// Gets the user currently signed in, or null if no user is signed in.
        /// </summary>
        /// <returns></returns>
        protected Task<Option<AppUser>> GetUser()
        {
            if (this.User.Identity.IsAuthenticated && !string.IsNullOrEmpty(this.User.Identity.Name))
            {
                return DbSession
                    .LoadOptionAsync<AppUser>("AppUsers/" + this.User.Identity.Name);
            }

            return Task.FromResult(Option.None<AppUser>());
        }

        protected async Task<AppUser> GetUserOrThrow()
        {
            var user = await this.GetUser();
            return user.ValueOr(() => throw new UnauthorizedAccessException());
        }

        protected string GetUserName()
        {
            return this.User.Identity.Name;
        }

        protected Option<string> GetUserId()
        {
            if (this.User.Identity.IsAuthenticated && !string.IsNullOrEmpty(this.User.Identity.Name))
            {
                return Option.Some(AppUser.IdPrefix + this.User.Identity.Name);
            }

            return Option.None<string>();
        }

        protected string GetUserIdOrThrow()
        {
            var userId = GetUserId();
            if (userId != null)
            {
                return userId.ValueOr(string.Empty);
            }

            throw new UnauthorizedAccessException();
        }
    }
}