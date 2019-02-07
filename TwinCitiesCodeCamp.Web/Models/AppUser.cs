using Raven.Identity;

namespace TwinCitiesCodeCamp.Models
{
    public class AppUser : IdentityUser
    {
        public string Bio { get; set; }
        public string PicUrl { get; set; }

        public const string IdPrefix = "AppUsers/";
    }
}
