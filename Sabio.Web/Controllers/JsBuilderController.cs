using Sabio.Models.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Sabio.Web.Controllers
{
    [RoutePrefix("dynamic/js")]
    [AllowAnonymous]
    public class JsBuilderController : Controller
    {
        private static string KIND_FORMAT = "{0}Kind";

        [Route("{view}/simple")]
        public ActionResult Simple(string view)
        {
            JscriptViewModel model = new JscriptViewModel();

            //great time to use the var keyword as it allows us to collect as many enums as we need
            var enumList = new
            {
                //Look at how the different Methods output the JS objects
                HttpStatusCodes = System.Net.HttpStatusCode.Accepted.ToDictionaryByValue()
                ,
                CommandBehaviors = System.Data.CommandBehavior.CloseConnection.ToDictionaryByValue()
            };

            Response.ContentType = "application/javascript";

            model.Name = String.Format(KIND_FORMAT, "Example"); //"ExampleNameKinds";
            model.Kinds = enumList;

            return View(view, model);
        }


        [Route("with/display/attributes")]
        public ActionResult UsingDisplayAttribute()
        {
            JscriptViewModel model = new JscriptViewModel();

            //great time to use the var keyword as it allows us to collect as many enums as we need
            var enumList = new
            {
                //Look at how the different Methods output the JS objects
                HttpStatusCodes = typeof(System.Net.HttpStatusCode).EnumByDisplay(1)
                ,
                CommandBehaviors = typeof(System.Net.HttpStatusCode).EnumByName(1)
            };

            Response.ContentType = "application/javascript";
            model.Name = String.Format(KIND_FORMAT, "Example"); //"ExampleNameKinds";
            model.Kinds = enumList;
            return View("Dynamic", model);
        }
    }
}