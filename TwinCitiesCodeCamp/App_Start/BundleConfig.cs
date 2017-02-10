using System.Web;
using System.Web.Optimization;

namespace TwinCitiesCodeCamp
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            var cdns = new
            {
                JQuery = "https://code.jquery.com/jquery-2.2.4.min.js",
                Bootstrap = "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js",
                Moment = "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.13.0/moment.min.js",
                Angular = "https://ajax.googleapis.com/ajax/libs/angularjs/1.6.1/angular.min.js",
                AngularAnimate = "https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.6.1/angular-animate.min.js",
                AngularRoute = "https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.6.1/angular-route.min.js",
                AngularBootstrap = "https://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/2.5.0/ui-bootstrap.min.js",
                AngularBootstrapTemplates = "https://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/2.5.0/ui-bootstrap-tpls.min.js",
                AngularLocalStorage = "https://cdnjs.cloudflare.com/ajax/libs/angular-local-storage/0.5.2/angular-local-storage.min.js",
                FastClick = "https://cdn.jsdelivr.net/fastclick/1.0.6/fastclick.min.js",
                NProgress = "https://cdn.jsdelivr.net/nprogress/0.1.6/js/nprogress.min.js",
                Lodash = "https://cdn.jsdelivr.net/lodash/4.13.1/lodash.min.js"
            };
            
            bundles.Add(new ScriptBundle("~/bundles/jquery", cdns.JQuery).Include("~/Scripts/jquery-{version}.js"));
            bundles.Add(new ScriptBundle("~/bundles/bootstrap", cdns.Bootstrap).Include("~/Scripts/bootstrap.js"));
            bundles.Add(new ScriptBundle("~/bundles/moment", cdns.Moment).Include("~/Scripts/moment.js"));
            bundles.Add(new ScriptBundle("~/bundles/angular", cdns.Angular).Include("~/Scripts/angular.js"));
            bundles.Add(new ScriptBundle("~/bundles/angular-animate", cdns.AngularAnimate).Include("~/Scripts/angular-animate.js"));
            bundles.Add(new ScriptBundle("~/bundles/angular-route", cdns.AngularRoute).Include("~/Scripts/angular-route.js"));
            bundles.Add(new ScriptBundle("~/bundles/angular-bootstrap", cdns.AngularBootstrap).Include("~/Scripts/angular-ui/ui-bootstrap.js"));
            bundles.Add(new ScriptBundle("~/bundles/angular-bootstrap-templates", cdns.AngularBootstrapTemplates).Include("~/Scripts/angular-ui/ui-bootstrap-tpls.js"));
            bundles.Add(new ScriptBundle("~/bundles/angular-local-storage", cdns.AngularLocalStorage).Include("~/Scripts/angular-local-storage.js"));
            bundles.Add(new ScriptBundle("~/bundles/fastclick", cdns.FastClick).Include("~/Scripts/fastclick.js"));
            bundles.Add(new ScriptBundle("~/bundles/nprogress", cdns.NProgress).Include("~/Scripts/nprogress.min.js"));
            bundles.Add(new ScriptBundle("~/bundles/lodash", cdns.Lodash).Include("~/Scripts/lodash.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/app").Include(
                "~/App/Polyfills/*.js")
                .Include("~/App/App.js", new AngularViewCacheBuster()).Include(
                "~/App/Common/*.js",
                "~/App/Controllers/*.js",
                "~/App/Models/*.js",
                "~/App/Services/*.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.min.css",
                      "~/Content/site.css"));

#if DEBUG
            BundleTable.EnableOptimizations = false;
            bundles.UseCdn = false;
#else
            BundleTable.EnableOptimizations = true;
            bundles.UseCdn = true;
#endif
        }
    }
}
