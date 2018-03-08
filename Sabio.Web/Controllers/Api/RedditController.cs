using Sabio.Models.Domain;
using Sabio.Models.Responses;
using Sabio.Services;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Sabio.Web.Controllers.Api
{
    [RoutePrefix("api/reddit")]
    [AllowAnonymous]
    public class RedditController : ApiController
    {
        readonly RedditScraperService redditService;

        public RedditController(RedditScraperService redditService)
        {
            this.redditService = redditService;
        }

        [HttpGet, Route("{subReddit}")]
        public HttpResponseMessage GetFrontPage(string subReddit)
        {
            ItemsResponse<RedditPost> itemsResponse = new ItemsResponse<RedditPost>();
            itemsResponse.Items = redditService.GetFrontPage(subReddit);

            return Request.CreateResponse(HttpStatusCode.OK, itemsResponse);
        }

      
    }
}
