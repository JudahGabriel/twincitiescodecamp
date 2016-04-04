using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(TwinCitiesCodeCamp2.Startup))]
namespace TwinCitiesCodeCamp2
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
