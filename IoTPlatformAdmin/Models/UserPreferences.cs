using System;
using Microsoft.Azure.Documents;
using Newtonsoft.Json;

namespace IoTPlatformAdmin.Models
{
    public class UserPreferences
    {
        [JsonProperty(PropertyName = "id")]
        public string Id { get; set; }

        [JsonProperty(PropertyName = "language")]
        public string Language { get; set; }

        [JsonProperty(PropertyName = "theme")]
        public string Theme { get; set; }

        [JsonProperty(PropertyName = "userId")]
        public string UserId { get; set; }
    }
}
