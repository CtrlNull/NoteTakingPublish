using System;
using System.Web.Http;

namespace Sabio.Web.Controllers.Api
{
    [RoutePrefix("api/guid")]
    [AllowAnonymous]
    public class GuidController : ApiController
    {
        [HttpGet]
        public string GetNewGuid()
        {
            return Guid.NewGuid().ToString("N");
        }
    }
}