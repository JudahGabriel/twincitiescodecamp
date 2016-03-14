using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(TwinCitiesCodeCamp.Startup))]
namespace TwinCitiesCodeCamp
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
