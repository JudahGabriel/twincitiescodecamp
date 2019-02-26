using Raven.Identity;
using System.Linq;

namespace TwinCitiesCodeCamp.Models
{
    public class AppUser : IdentityUser
    {
        public string Bio { get; set; }
        public string PicUrl { get; set; }

        public const string IdPrefix = "AppUsers/";

        public bool IsAdmin()
        {
            return this.Roles.Contains(Models.Roles.Admin);
        }
    }
}
