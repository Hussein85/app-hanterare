using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IoTPlatformAdmin.Models
{
    public class DocumentDBConfig
    {
        public string EndPoint { get; set; }
        public string AuthKey { get; set; }
        public string DataBaseId { get; set; }
        public string CollectionId { get; set; }
    }
}
