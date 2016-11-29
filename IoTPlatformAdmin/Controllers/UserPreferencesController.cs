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
    [Authorize]
    [Route("api/[controller]")]
    public class UserPreferencesController : Controller
    {


        private const string _endpoint = "https://iotplatform.documents.azure.com:443/";
        private const string _authKey = "mwbQo1etUkesU9lDtHOmzPPnjJqX0wKQQQAAfdwGLlLQRd0GutA7Myimh8TDUEGwCPyP5gr2NJTg8qZX1w2Thg==";
        private static readonly string _databaseId = "IotPlatformAdmin";
        private static readonly string CollectionId = "UserPreferences";



        [HttpGet()]
        [Route("")]
        public async Task<IActionResult> GetAllUserPreferences()
        {
            var docDbRepo = new DocumentDbRepository<UserPreferences>(CacheClient.GetDatabaseClient(_endpoint, _authKey), _databaseId, CollectionId);
            //var pref = docDbRepo.Query().FirstOrDefault(f => f.UserId == GetUserId());

            var pref = docDbRepo.Query($"SELECT * FROM c");
            //var first = pref.FirstOrDefault<UserPreferences>();
            //var pref2 = docDbRepo.Query($"SELECT * FROM c");

            if (pref != null)
            {
                return Ok(pref);
            }

            return NotFound();
        }

        //TODO: Remove userPrefId, but I got an server error
        [HttpGet()]
        [Route("{userPrefId}")]
        public async Task<IActionResult> GetSpecificUserPreference(string userPrefId)
        {
            var docDbRepo = new DocumentDbRepository<UserPreferences>(CacheClient.GetDatabaseClient(_endpoint, _authKey), _databaseId, CollectionId);

            var pref = docDbRepo.Query($"SELECT * FROM c WHERE c.userId = '{GetUserId()}'").ToList();

            if (pref.Any())
            {
                return Ok(pref[0]);
            }
            else
            {
                // Create default userPreferences if no userPreferences exists
                UserPreferences defaultPrefs = new UserPreferences
                {
                    Id = Guid.NewGuid().ToString(),
                    Language = "eng",
                    Theme = "light",
                    UserId = GetUserId()
                };

              
                var result = await docDbRepo.CreateItemAsync(defaultPrefs);

                return Ok(result);
            }
   
        }

        [HttpPut]
        [Route("")]
        public async Task<IActionResult> UpdateUserPreference(UserPreferences userPreference)
        {
            var docDbRepo = new DocumentDbRepository<UserPreferences>(CacheClient.GetDatabaseClient(_endpoint, _authKey), _databaseId, CollectionId);

            var pref = docDbRepo.DocumentQuery($"SELECT * FROM c WHERE c.id = '{userPreference.Id}'").ToList();

            if (pref.Any())
            {
                var result = await docDbRepo.UpdateItemAsync(pref[0].Id, userPreference);
                return Ok(result);
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





        //[HttpGet()]
        //[Route("{userPrefId}")]
        //public async Task<IActionResult> GetSpecificUserPreference(string userPrefId)
        //{
        //    var docDbRepo = new DocumentDbRepository<UserPreferences>(CacheClient.GetDatabaseClient(_endpoint, _authKey), _databaseId, CollectionId);

        //    //var pref = docDbRepo.Query().FirstOrDefault(f => f.UserId == GetUserId());
        //    var pref = docDbRepo.Query($"SELECT * FROM c WHERE c.id = '{userPrefId}'").ToList();

        //    //var first = pref.FirstOrDefault<UserPreferences>();
        //    //var pref2 = docDbRepo.Query($"SELECT * FROM c");

        //    if (pref.Any())
        //    {
        //        return Ok(pref[0]);
        //    }

        //    return NotFound();

        //}







        /*
        [HttpPost]
        [Route("")]
        public async Task<IActionResult> UpdateUserPreference()
        {
            var docDbRepo = new DocumentDbRepository<UserPreferences>(CacheClient.GetDatabaseClient(_endpoint, _authKey), _databaseId, CollectionId);

            if (userPreference == null)
            {
                UserPreferences defaultPrefs = new UserPreferences
                {
                    Id = Guid.NewGuid().ToString(),
                    Language = "eng",
                    Theme = "light",
                    UserId = GetUserId()
                };

                var result = await docDbRepo.CreateItemAsync(defaultPrefs);
            }
            else
            {
                var pref = docDbRepo.DocumentQuery($"SELECT * FROM c WHERE c.id = '{userPreference.Id}'").ToList();
                if (pref.Any())
                {
                    var result = await docDbRepo.UpdateItemAsync(pref[0].Id, userPreference);
                }
            }

            return Ok();

        }
        */





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








