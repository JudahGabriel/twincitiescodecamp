using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Formatting;
using System.Web.Http;

namespace TwinCitiesCodeCamp
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            // Use camelCasing when returning results from the API.
            config.Formatters.OfType<JsonMediaTypeFormatter>().First().SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
        }
    }
}
