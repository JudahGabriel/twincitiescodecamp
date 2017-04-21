using Raven.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace TwinCitiesCodeCamp.Common
{
    public static class RavenExtensions
    {
        public static async Task<T> LoadNotNull<T>(this IAsyncDocumentSession session, string id)
        {
            var result = await session.LoadAsync<T>(id);
            if (result == null)
            {
                throw new ArgumentException($"Tried to load {id} but it was null.");
            }

            return result;
        }

        public static async Task<IEnumerable<T>> LoadFilterOutNulls<T>(this IAsyncDocumentSession session, IEnumerable<string> ids)
        {
            var result = await session.LoadAsync<T>(ids);
            return result.Where(r => r != null);
        }
    }
}