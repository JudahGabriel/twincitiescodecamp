using Optional;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace TwinCitiesCodeCamp.Common
{
    public static class OptionalAsyncExtensions
    {
        /// <summary>
        /// Wraps the result of the task in the an Option.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="task"></param>
        /// <returns></returns>
        public static async Task<Option<T>> SomeNotNullAsync<T>(this Task<T> task)
        {
            var result = await task;
            return result.SomeNotNull();
        }
    }
}