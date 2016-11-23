using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using IoTPlatformAdmin.Models;

using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;
using Microsoft.Azure.Documents.Linq;
using System.Security.Claims;

namespace IoTPlatformAdmin.Controllers
{
    [Route("api/[controller]")]
    public class UserPreferencesController : Controller
    {


        private const string _endpoint = "https://iotplatform.documents.azure.com:443/";
        private const string _authKey = "mwbQo1etUkesU9lDtHOmzPPnjJqX0wKQQQAAfdwGLlLQRd0GutA7Myimh8TDUEGwCPyP5gr2NJTg8qZX1w2Thg==";
        private static readonly string _databaseId = "IotPlatformAdmin";
        private static readonly string CollectionId = "UserPreferences";


        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetUserPreferences()
        {
            var docDbRepo = new DocumentDbRepository<UserPreferences>(CacheClient.GetDatabaseClient(_endpoint, _authKey), _databaseId, CollectionId);
            var pref = docDbRepo.Query().FirstOrDefault(f => f.UserId == GetUserId());

            if (pref != null)
            {
                return Ok(pref);
            }

            return NotFound();

        }


        protected string GetUserId()
        {
            var claimsIdentity = User.Identity as ClaimsIdentity;

            if (claimsIdentity != null)
            {
                return claimsIdentity.FindAll(t => t.Properties.Values.Contains("sub")).Single().Value;
            }

            return null;
        }

        /*
        [Authorize]
        [HttpGet("[action]")]
        public IEnumerable<UserSettings> getUserSettings()
        {
            var rng = new Random();
            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                DateFormatted = DateTime.Now.AddDays(index).ToString("d"),
                TemperatureC = rng.Next(-20, 55),
                Summary = Summaries[rng.Next(Summaries.Length)]
            });
        }
        */



    }
}








