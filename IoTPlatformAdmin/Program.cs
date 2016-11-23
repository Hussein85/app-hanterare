using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;


// DocumentDB
using System.Net;
using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;
using Newtonsoft.Json;

namespace IoTPlatformAdmin
{
    public class Program
    {
        // ADD THIS PART TO YOUR CODE
        private const string EndpointUri = "https://iotplatform.documents.azure.com:443/";
        private const string PrimaryKey = "mwbQo1etUkesU9lDtHOmzPPnjJqX0wKQQQAAfdwGLlLQRd0GutA7Myimh8TDUEGwCPyP5gr2NJTg8qZX1w2Thg==";
        private DocumentClient client;

        public static void Main(string[] args)
        {
            var config = new ConfigurationBuilder()
                .AddCommandLine(args)
                .AddEnvironmentVariables(prefix: "ASPNETCORE_")
                .Build();

            var host = new WebHostBuilder()
                .UseConfiguration(config)
                .UseKestrel()
                .UseContentRoot(Directory.GetCurrentDirectory())
                .UseIISIntegration()
                .UseStartup<Startup>()
                .Build();

            host.Run();
        }
    }
}
