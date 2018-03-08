using Sabio.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Principal;
using System.Web;
using System.Web.Http;
using Sabio.Services.Security;

namespace Sabio.Web.Controllers.Api
{
    [RoutePrefix("api/tests/auth")]
    public class TestAuthController : ApiController
    {
        private IUserService _userService;
        private IAuthenticationService _auth;
        private IPrincipal _principal;

        public TestAuthController(IUserService userService, IAuthenticationService auth, IPrincipal principal)
        {
            _userService = userService;
            _auth = auth;
            _principal = principal;
        }

       

        [Route("login/{id:int?}/{userName}/{role}"), HttpGet, AllowAnonymous]
        public HttpResponseMessage LogIn(int id, string userName, string role)
        {
            _userService.LogInTest(userName + "@sabio.la", "Sabiopass1!", id, new string[] { role });

            return Request.CreateResponse(HttpStatusCode.OK, new Sabio.Models.Responses.SuccessResponse());
        }

        [Route("logout"), HttpGet]
        public HttpResponseMessage Logout()
        {
            _auth.LogOut();

            return Request.CreateResponse(HttpStatusCode.OK, new Sabio.Models.Responses.SuccessResponse());
        }


        [Route("current"), HttpGet]
        public HttpResponseMessage Current()
        {
            return Request.CreateResponse(HttpStatusCode.OK, _principal.Identity.GetCurrentUser());
        }

        [Route("current/Authorized"), HttpGet][Authorize]
        public HttpResponseMessage CurrentAuth()
        {
            return Request.CreateResponse(HttpStatusCode.OK, _principal.Identity.GetCurrentUser());
        }

        [Route("current/roles/manager"), HttpGet]
        [Authorize(Roles="Content Manager")]
        public HttpResponseMessage CurrentAuthManager()
        {
            return Request.CreateResponse(HttpStatusCode.OK, _principal.Identity.GetCurrentUser());
        }

        [Route("current/roles/super"), HttpGet]
        [Authorize(Roles = "Super")]
        public HttpResponseMessage Super()
        {
            return Request.CreateResponse(HttpStatusCode.OK, _principal.Identity.GetCurrentUser());
        }

        [Route("current/roles/RoleFive"), HttpGet]
        [Authorize(Roles = "RoleFive")]
        public HttpResponseMessage RoleFive()
        {
            return Request.CreateResponse(HttpStatusCode.OK, _auth.GetCurrentUser());
        }
    }
}
