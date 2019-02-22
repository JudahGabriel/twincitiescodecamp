using Raven.Abstractions.Indexing;
using Raven.Client.Indexes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using TwinCitiesCodeCamp.Models;

namespace TwinCitiesCodeCamp.Data
{
    /// <summary>
    /// RavenDB index that gets all the unique tags from all talks.
    /// </summary>
    public class Talks_Tags : AbstractIndexCreationTask<Talk, Talks_Tags.Result>
    {
        public class Result
        {
            public string Name { get; set; }
        }

        public Talks_Tags()
        {
            this.Map = talks => from talk in talks
                                from tag in talk.Tags
                                select new Result
                                {
                                    Name = tag
                                };
            Reduce = results => from result in results
                                group result by result.Name into g
                                select new Result
                                {
                                    Name = g.Key
                                };

            Index(r => r.Name, FieldIndexing.Default);
            StoreAllFields(FieldStorage.Yes);
        }
    }
}