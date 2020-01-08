using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Raven.DependencyInjection;
using Raven.Identity;
using Raven.Migrations;
using Raven.StructuredLog;
using TwinCitiesCodeCamp.Models;

namespace TwinCitiesCodeCamp
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<CookiePolicyOptions>(options =>
            {
                // This lambda determines whether user consent for non-essential cookies is needed for a given request.
                options.CheckConsentNeeded = context => true;
                options.MinimumSameSitePolicy = SameSiteMode.None;
            });

            // Setup Raven
            services
                .AddRavenDbDocStore()
                .AddRavenDbAsyncSession()
                .AddLogging(logger => logger.AddRavenStructuredLogger())
                .AddRavenDbMigrations();

            var identity = services.AddRavenDbIdentity<AppUser>(o =>
            {
                o.Password.RequireDigit = true;
                o.Password.RequiredLength = 7;
                o.Password.RequireUppercase = false;
                o.Password.RequireNonAlphanumeric = false;
            });
            identity.AddDefaultUI(UIFramework.Bootstrap4);

            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
            services.AddProgressiveWebApp();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseStaticFiles();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");

                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();

                // Heavy caching for static files.
                // We set immutable (for new browsers) and a 60 day cache time.
                // We use ?v= query string to cache bust out-of-date files, so this works quite nicely.
                app.UseStaticFiles(new StaticFileOptions
                {
                    OnPrepareResponse = ctx =>
                    {
                        ctx.Context.Response.Headers[Microsoft.Net.Http.Headers.HeaderNames.CacheControl] =
                            "immutable,public,max-age=" + TimeSpan.FromDays(60).TotalSeconds;
                    }
                });
            }

            app.UseHttpsRedirection();
            app.UseCookiePolicy();
            app.UseAuthentication();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });

            var migrationService = app.ApplicationServices.GetRequiredService<MigrationRunner>();
            migrationService.Run();
        }
    }
}
