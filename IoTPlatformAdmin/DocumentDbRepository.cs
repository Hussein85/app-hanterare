using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;
using Microsoft.Azure.Documents.Linq;

namespace IoTPlatformAdmin
{
    public class DocumentDbRepository<T>
    {
        private readonly string _databaseId;
        private readonly string _collectionId;
        private static Dictionary<string, Database> _databaseCache = new Dictionary<string, Database>();
        private static Dictionary<string, DocumentCollection> _collectiontCache = new Dictionary<string, DocumentCollection>();

        public DocumentDbRepository(DocumentClient client, string databaseId, string collection)
        {
            this.client = client;
            _databaseId = databaseId;
            _collectionId = collection;
        }

        private Database database;
        private Database Database
        {
            get
            {
                if (database == null)
                {
                    if (_databaseCache.ContainsKey(_databaseId))
                    {
                        database = _databaseCache[_databaseId];
                    }
                    else
                    {
                        database = ReadOrCreateDatabaseAsync().Result;
                        _databaseCache.Add(_databaseId, database);
                    }
                }

                return database;
            }
        }

        private DocumentCollection collection;
        private DocumentCollection Collection
        {
            get
            {
                if (collection == null)
                {
                    if (_collectiontCache.ContainsKey(_collectionId))
                    {
                        collection = _collectiontCache[_collectionId];
                    }
                    else
                    {
                        collection = ReadOrCreateCollectionAsync(Database.SelfLink).Result;
                        _collectiontCache.Add(_collectionId, collection);
                    }
                }

                return collection;
            }
        }

        private DocumentClient client;
        private DocumentClient Client
        {
            get
            {
                return client;
            }
        }

        private async Task<DocumentCollection> ReadOrCreateCollectionAsync(string databaseLink)
        {
            var col = Client.CreateDocumentCollectionQuery(databaseLink)
                              .Where(c => c.Id == _collectionId)
                              .AsEnumerable()
                              .FirstOrDefault();

            if (col == null)
            {
                col = await Client.CreateDocumentCollectionAsync(databaseLink, new DocumentCollection { Id = _collectionId });
            }

            return col;
        }

        private async Task<Database> ReadOrCreateDatabaseAsync()
        {
            var db = Client.CreateDatabaseQuery()
                            .Where(d => d.Id == _databaseId)
                            .AsEnumerable()
                            .FirstOrDefault();

            if (db == null)
            {
                db = await Client.CreateDatabaseAsync(new Database { Id = _databaseId });
            }

            return db;
        }

        public async Task<bool> ReCreateCollectionAsync()
        {
            try
            {
                await client.DeleteDocumentCollectionAsync(Collection.SelfLink);
                var col = Collection;
            }
            catch (Exception)
            {
                return false;
            }

            return true;
        }

        public async Task<Document> CreateItemAsync(T item)
        {
            return await Client.CreateDocumentAsync(Collection.SelfLink, item);
        }

        public T GetItem(Expression<Func<T, bool>> predicate)
        {
            return Client.CreateDocumentQuery<T>(Collection.DocumentsLink)
                        .Where(predicate)
                        .AsEnumerable()
                        .FirstOrDefault();
        }

        public IEnumerable<T> GetItems(Expression<Func<T, bool>> predicate)
        {
            return Client.CreateDocumentQuery<T>(Collection.DocumentsLink)
                        .Where(predicate)
                        .AsEnumerable();
        }

        public IEnumerable<T> GetItems(string query)
        {
            return Client.CreateDocumentQuery<T>(Collection.DocumentsLink, query);
        }

        public IEnumerable<T> GetAllItems()
        {
            return Client.CreateDocumentQuery<T>(Collection.DocumentsLink)
                        .AsEnumerable();
        }

        public IQueryable<T> Query()
        {
            return Client.CreateDocumentQuery<T>(Collection.DocumentsLink);
        }

        public IQueryable<T> Query(string sql)
        {
            return Client.CreateDocumentQuery<T>("dbs/" + Database.Id + "/colls/" + Collection.Id, sql);
        }

        public Document GetDocument(string id)
        {
            return Client.CreateDocumentQuery(Collection.DocumentsLink)
                                .Where(d => d.Id == id)
                                .AsEnumerable()
                                .FirstOrDefault();
        }

        public async Task<Document> UpdateItemAsync(string id, T item)
        {
            Document doc = GetDocument(id);
            return await Client.ReplaceDocumentAsync(doc.SelfLink, item);
        }

        public async Task DeleteItemAsync(string id)
        {
            Document doc = GetDocument(id);
            await client.DeleteDocumentAsync(doc.SelfLink);
        }

        public async Task DeleteAllItemsAsync()
        {
            var sql = "SELECT * FROM c";
            IEnumerable<Document> documents = Client.CreateDocumentQuery<Document>("dbs/" + Database.Id + "/colls/" + Collection.Id, sql);

            foreach (var document in documents)
            {
                await client.DeleteDocumentAsync(document.SelfLink);
            }
        }
    }

    internal class DatabaseCollection
    {
        public DocumentCollection DocumentCollection { get; set; }
        public Database Database { get; set; }
    }
}