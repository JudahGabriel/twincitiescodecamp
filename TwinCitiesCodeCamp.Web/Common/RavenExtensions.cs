﻿using Optional;
using Optional.Collections;
using Optional.Unsafe;
using Raven.Client.Documents;
using Raven.Client.Documents.Indexes;
using Raven.Client.Documents.Operations;
using Raven.Client.Documents.Session;
using Raven.Client.Documents.Session.Loaders;
using Raven.Client.Documents.Session.Operations.Lazy;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TwinCitiesCodeCamp.Common
{
    public static class RavenExtensions
    {
        /// <summary>
        /// Asynchronously loads a document from Raven and stores it in an Option. 
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="session"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public static async Task<Option<T>> LoadOptionAsync<T>(this IAsyncDocumentSession session, string id)
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                return Option.None<T>();
            }

            var result = await session.LoadAsync<T>(id);
            return result.SomeNotNull();
        }

        /// <summary>
        /// Asynchronously loads a document from Raven and stores it in an Option.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="session"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public static async Task<Option<T>> LoadOptionAsync<T>(this IAsyncDocumentSession session, Option<string> id)
        {
            if (id.HasValue && !string.IsNullOrEmpty(id.ValueOrDefault()))
            {
                var result = await session.LoadAsync<T>(id.ValueOrDefault());
                return result.SomeNotNull();
            }

            return Option.None<T>();
        }

        /// <summary>
        /// Asynchronously loads multiple documents from Raven and stores it in an Option.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="session"></param>
        /// <param name="ids">The IDs of the documents to load.</param>
        /// <returns></returns>
        public static async Task<IEnumerable<Option<T>>> LoadOptionAsync<T>(this IAsyncDocumentSession session, IEnumerable<string> ids)
        {
            var result = await session.LoadAsync<T>(ids);
            return result.Select(v => v.Value.SomeNotNull());
        }

        /// <summary>
        /// Asynchronously loads a multiple from Raven and returns the ones that aren't null.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="session"></param>
        /// <param name="ids"></param>
        /// <returns></returns>
        public static async Task<IEnumerable<T>> LoadWithoutNulls<T>(this IAsyncDocumentSession session, IEnumerable<string> ids)
        {
            var result = await session.LoadAsync<T>(ids);
            return result
                .Select(kv => kv.Value)
                .Where(item => item != null);
        }

        /// <summary>
        /// Loads a document from the database and throws if it's null.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="session"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public static async Task<T> LoadRequiredAsync<T>(this IAsyncDocumentSession session, string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                throw new ArgumentNullException("Id must not be null.");
            }

            var result = await session.LoadAsync<T>(id);
            if (result == null)
            {
                throw new ArgumentException($"Tried to load {id}, but it wasn't found in the database.");
            }

            return result;
        }

        /// <summary>
        /// Loads a document from the session and throws the specified exception if null.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="session"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public static async Task<T> LoadRequiredAsync<T, TException>(this IAsyncDocumentSession session, string id, Func<TException> thrower)
            where TException : Exception
        {
            var result = await session.LoadAsync<T>(id);
            if (result == null)
            {
                throw thrower();
            }

            return result;
        }

        /// <summary>
        /// Loads a document from the session and throws if it's null.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="session"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public static async Task<T> LoadRequiredAsync<T>(this IAsyncLoaderWithInclude<T> session, string id)
        {
            var result = await session.LoadAsync<T>(id);
            if (result == null)
            {
                throw new ArgumentException($"Tried to load {id} but was null.");
            }

            return result;
        }

        /// <summary>
        /// Loads a document from the session and throws the specified exception if null.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="session"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public static async Task<T> LoadRequiredAsync<T, TException>(this IAsyncLoaderWithInclude<T> session, string id, Func<TException> thrower)
            where TException : Exception
        {
            var result = await session.LoadAsync<T>(id);
            if (result == null)
            {
                throw thrower();
            }

            return result;
        }

        /// <summary>
        /// Lazily loads a document from the session. When the value is accessed, an exception will be thrown if the document is null.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="session"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public static Lazy<Task<T>> LoadRequiredAsync<T>(this IAsyncLazySessionOperations sessionOps, string id)
        {
            var loadTask = sessionOps.LoadAsync<T>(id);
            var wrappedLazy = new Lazy<Task<T>>(() =>
            {
                var result = loadTask.Value;
                return result.ContinueWith(t =>
                {
                    if (t.Result == null)
                    {
                        throw new ArgumentException($"Tried to lazily load {id}, but it wasn't found in the database.");
                    }

                    return t.Result;
                }, TaskContinuationOptions.OnlyOnRanToCompletion);
            }, isThreadSafe: false);

            return wrappedLazy;
        }

        /// <summary>
        /// Asynchronously loads a document from Raven and stores it in an Option.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="session"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public static async Task<Option<T>> LoadOptionAsync<T>(this IAsyncLoaderWithInclude<T> session, string id)
        {
            var result = await session.LoadAsync<T>(id);
            return result.SomeNotNull();
        }

        /// <summary>
        /// Asynchronously loads multiple documents from Raven and returns them as Options.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="session"></param>
        /// <param name="ids"></param>
        /// <returns></returns>
        public static async Task<IEnumerable<Option<T>>> LoadOptionAsync<T>(this IAsyncLoaderWithInclude<T> session, IEnumerable<string> ids)
        {
            var result = await session.LoadAsync<T>(ids);
            return result.Select(kv => kv.Value.SomeNotNull());
        }

        /// <summary>
        /// Loads a document from Raven and returns it as an Option.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="session"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public static Option<T> LoadOption<T>(this IDocumentSession session, string id)
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                return default(T).None();
            }
            return session.Load<T>(id).SomeNotNull();
        }

        /// <summary>
        /// Lazily loads an entity from the Raven. The result is wrapped as an optional value.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="lazyOps"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public static Lazy<Task<Option<T>>> LoadOptionAsync<T>(this IAsyncLazySessionOperations lazyOps, string id)
        {
            var loadTask = lazyOps.LoadAsync<T>(id);
            var optionTask = new Lazy<Task<Option<T>>>(() =>
            {
                var result = loadTask.Value;
                return result.ContinueWith(t => t.Result.SomeNotNull(), TaskContinuationOptions.OnlyOnRanToCompletion);
            }, isThreadSafe: false);

            return optionTask;
        }

        /// <summary>
        /// Sets the Raven document expiration for this object. The document will be deleted from the database after the specified date.
        /// Note: This specified object must be .Store()'d in the database before calling this method.
        /// </summary>
        public static void SetRavenExpiration<T>(this IAsyncDocumentSession dbSession, T obj, DateTime expiry)
        {
            dbSession.Advanced.GetMetadataFor(obj)["@expires"] = expiry.ToString("o", System.Globalization.CultureInfo.InvariantCulture);
        }

        /// <summary>
        /// Sets the Raven document expiration for this object. The document will be deleted from the database after the specified date.
        /// Note: This specified object must be .Store()'d in the database before calling this method.
        /// </summary>
        public static void SetRavenExpiration<T>(this IDocumentSession dbSession, T obj, DateTime expiry)
        {
            dbSession.Advanced.GetMetadataFor(obj)["@expires"] = DateTime.UtcNow.ToString("o", System.Globalization.CultureInfo.InvariantCulture);
        }

        public static Operation PatchAll<T>(this IDocumentStore db, string jsPatchScript)
        {
            return PatchAll(db, db.Conventions.GetCollectionName(typeof(T)), jsPatchScript, default(Dictionary<string, object>).None());
        }

        public static Operation PatchAll<T>(this IDocumentStore db, string jsPatchScript, Option<Dictionary<string, object>> variables)
        {
            return PatchAll(db, db.Conventions.GetCollectionName(typeof(T)), jsPatchScript, variables);
        }

        public static Operation PatchAll(this IDocumentStore db, string collectionName, string jsPatchScript)
        {
            return PatchAll(db, collectionName, jsPatchScript, default(Dictionary<string, object>).None());
        }

        public static Operation PatchAll(this IDocumentStore db, string collectionName, string jsPatchScript, Option<Dictionary<string, object>> variables)
        {
            // Patch is in RQL. Example: "from AppUsers update { this.Foo = 123; }"
            var rqlPatch = new StringBuilder();

            // For each variable in the dictionary, declare the variable in the RQL script.
            variables
                .Map(i => i.AsEnumerable())
                .ValueOr(Enumerable.Empty<KeyValuePair<string, object>>())
                .Select(kv =>
                {
                    var variableValue = kv.Value?.ToString();
                    var escapedVariableValue = variableValue?.Replace("\"", "\\\""); // replace any quotes with escaped quotes. 'Hi I am a "JS" string' -> 'Hi I am a \"JS\" string'
                    var escapedWithQuotes = kv.Value is string ? "\"" + escapedVariableValue + "\"" : escapedVariableValue; // string? Surround the value with quotes. foo -> "foo"
                    return $"var {kv.Key} = {escapedWithQuotes};"; // The actual variable declaration, e.g. var foo = "123";
                })
                .ForEach(v => rqlPatch.AppendLine(v));

            rqlPatch.AppendLine($"from {collectionName}");
            rqlPatch.AppendLine("update {");
            rqlPatch.AppendLine(jsPatchScript);
            rqlPatch.Append('}');

            var patch = new PatchByQueryOperation(new Raven.Client.Documents.Queries.IndexQuery
            {
                Query = rqlPatch.ToString()
            });
            return db.Operations.Send(patch);
        }

        /// <summary>
        /// Asks Raven for suggestions for the specified search term. If there are suggestions, it creates a query for the first suggestion.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <typeparam name="TIndexCreator"></typeparam>
        /// <param name="dbSession"></param>
        /// <param name="fieldSelector">The field to query on.</param>
        /// <returns>The query results for the first suggestion.</returns>
        public static async Task<Option<string>> QueryForSuggestion<T, TIndexCreator>(this IAsyncDocumentSession dbSession, string search, System.Linq.Expressions.Expression<Func<T, object>> fieldSelector)
            where TIndexCreator : AbstractIndexCreationTask, new()
        {
            var suggestResults = await dbSession.Query<T, TIndexCreator>()
                .SuggestUsing(b => b.ByField(fieldSelector, search))
                .ExecuteAsync();
            return suggestResults
                .FirstOrNone()
                .FlatMap(s => s.Value.SomeNotNull())
                .FlatMap(r => r.Suggestions.FirstOrNone());
        }
    }
}
