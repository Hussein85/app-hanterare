using System;

using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using IoTPlatformAdmin.Models;

using System.Security.Claims;
using Microsoft.Extensions.Options;

namespace IoTPlatformAdmin.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class UserPreferencesController : Controller
    {

        private readonly string _endpoint;
        private readonly string _authKey;
        private readonly string _databaseId;
        private readonly string CollectionId;

        public DocumentDBConfig DocumentDBConfig { get; }


        public UserPreferencesController(IOptions<DocumentDBConfig> documentDBConfig)
        {
            DocumentDBConfig = documentDBConfig.Value;

            _endpoint = DocumentDBConfig.EndPoint;
            _authKey = DocumentDBConfig.AuthKey;
            _databaseId = DocumentDBConfig.DataBaseId;
            CollectionId = DocumentDBConfig.CollectionId;
        }



        [HttpGet()]
        [Route("")]
        public async Task<IActionResult> GetUserPreferences()
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
                    Language = "en",
                    Theme = "default",
                    UserId = GetUserId()
                };


                var result = await docDbRepo.CreateItemAsync(defaultPrefs);

                return Ok(result);
            }

        }


        [HttpPut]
        [Route("")]
        public async Task<IActionResult> UpdateUserPreferences([FromBody] UserPreferences userPreferences)
        {
            var docDbRepo = new DocumentDbRepository<UserPreferences>(CacheClient.GetDatabaseClient(_endpoint, _authKey), _databaseId, CollectionId);

            var pref = docDbRepo.DocumentQuery($"SELECT * FROM c WHERE c.id = '{userPreferences.Id}'").ToList();

            if (pref.Any())
            {
                var result = await docDbRepo.UpdateItemAsync(pref[0].Id, userPreferences);
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


        
    }
}








