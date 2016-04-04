using System.Web;
using System.Web.Optimization;

namespace TwinCitiesCodeCamp
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery", "https://code.jquery.com/jquery-2.2.2.min.js").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/moment", "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.12.0/moment.min.js").Include(
                "~/Scripts/moment.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/nprogress", "https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.js").Include(
                "~/Scripts/nprogress.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/angular").Include(
                "~/Scripts/angular.js",
                "~/Scripts/angular-animate.js",
                "~/Scripts/angular-route.js",
                "~/Scripts/angular-ui/ui-bootstrap.js",
                "~/Scripts/angular-ui/ui-bootstrap-tpls.js",
                "~/Scripts/angular-local-storage.js",
                "~/Scripts/nprogress.js"));

            bundles.Add(new ScriptBundle("~/bundles/app").Include(
                "~/App/Polyfills/*.js",
                "~/App/App.js",
                "~/App/Common/*.js",
                "~/App/Controllers/*.js",
                "~/App/Models/*.js",
                "~/App/Services/*.js"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js"));

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
