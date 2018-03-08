using Sabio.Models;
using Sabio.Models.Requests;
using Sabio.Models.Responses;
using Sabio.Services;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Threading.Tasks;

namespace Sabio.Web.Controllers.Api
{
    [RoutePrefix("api/backup")]
    [AllowAnonymous] // does not require a valid cookie
    public class BackupController : ApiController
    {
        readonly IBackupService backupService;

        public BackupController(IBackupService backupService)
        {
            this.backupService = backupService;
        }

        [HttpPost, Route("sync")]
        public HttpResponseMessage SyncNotes(NoteBackupRequest request)
        {
            // check if the request is empty
            if (request == null)
            {
                ModelState.AddModelError("", "Missing body data.");
            }
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }

            ItemsResponse<GlobalNoteId> itemsResponse = new ItemsResponse<GlobalNoteId>();
            itemsResponse.Items = backupService.SyncNotes(request);
            return Request.CreateResponse(HttpStatusCode.OK, itemsResponse);
        }

        [HttpPost, Route("update")]
        public async Task<HttpResponseMessage> UpdateNotes()
        {
            string result = await Request.Content.ReadAsStringAsync();

            backupService.UpdateNotes(result);
            return Request.CreateResponse(HttpStatusCode.OK);
        }
    }
}