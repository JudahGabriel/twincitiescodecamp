using Raven.Client;
using Raven.Client.Document;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TwinCitiesCodeCamp.Data
{
    public static class RavenContext
    {
        public static IDocumentStore Db { get; private set; }

        public static void Initialize()
        {
            if (Db == null)
            {
                Db = new DocumentStore { ConnectionStringName = "RavenDb" };
                Db.Initialize();

                // Create our indexes.
                new Talks_Tags().Execute(Db);
            }
        }
    }
}