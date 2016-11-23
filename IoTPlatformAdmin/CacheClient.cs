using Microsoft.Azure.Documents.Client;
using System;
namespace IoTPlatformAdmin
{
    public static class CacheClient
    {
        private static DocumentClient _databaseClient;

        public static DocumentClient GetDatabaseClient(string endpoint, string authKey)
        {
            if (_databaseClient == null)
            {
                Uri endpointUri = new Uri(endpoint);
                _databaseClient = new DocumentClient(endpointUri, authKey);
            }
            return _databaseClient;
        }
    }
}
