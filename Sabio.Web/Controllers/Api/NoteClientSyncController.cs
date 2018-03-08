using Sabio.Models.Domain;
using Sabio.Services.Interfaces;
using Sabio.Models.Responses;
using Sabio.Models.Requests;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Sabio.Web.Controllers.Api
{
    [RoutePrefix("api/noteclientsync")]
    [AllowAnonymous]
    public class NoteClientSyncController : ApiController
    {
        readonly INoteClientSyncService noteClientSyncService;

        public NoteClientSyncController(INoteClientSyncService noteClientSyncService)
        {
            this.noteClientSyncService = noteClientSyncService;
        }
        
        [Route, HttpGet]
        public HttpResponseMessage TagsGetAll()
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
            else
            {
                List<TagsGetAllResponse> results = noteClientSyncService.TagsGetAll();
                return Request.CreateResponse(HttpStatusCode.Created, results);
            }
        }


        [Route("firstrequest"), HttpPost]
        public HttpResponseMessage FirstRequest(Sabio.Models.Requests.NoteClientSyncFirstRequest firstRequest)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
            else
            {
                List<NoteClientSyncFirstResponse> List = noteClientSyncService.FirstRequest(firstRequest);
                return Request.CreateResponse(HttpStatusCode.Created, List);
            }
        }

        [Route("secondrequest"), HttpPost]
        public HttpResponseMessage SecondRequest(Sabio.Models.Requests.NoteClientSyncSecondRequest secondRequest)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
            else
            {
                List<NoteClientSyncSecondResponse> List = noteClientSyncService.SecondRequest(secondRequest);
                return Request.CreateResponse(HttpStatusCode.Created, List);
            }
        }
    }
}
