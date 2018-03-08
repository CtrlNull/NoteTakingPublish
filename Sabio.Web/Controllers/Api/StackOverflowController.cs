using System;
using System.Collections.Generic;
using System.Linq;
using Sabio.Services;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Sabio.Models.Responses;
using Sabio.Models.Domain;

namespace Sabio.Web.Controllers.Api
{
    [RoutePrefix("api/stack")]
    [AllowAnonymous]
    public class StackOverflowController : ApiController
    {
        readonly StackOverflowService stackService;

        public StackOverflowController(StackOverflowService stackService)
        {
            this.stackService = stackService;
        }

        [HttpGet,Route]
        public HttpResponseMessage SearchStackOverflow(string query)
        {
            ItemsResponse<StackOverflow> itemsResponse = new ItemsResponse<StackOverflow>();
            itemsResponse.Items = stackService.SearchStackOverflow(query);

            return Request.CreateResponse(HttpStatusCode.OK, itemsResponse);
        }

    }
}
