using Sabio.Models.Domain;
using Sabio.Models.Requests;
using Sabio.Models.Responses;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Sabio.Web.Controllers
{
    // Add the "RoutePrefix" attribute to the class
    [RoutePrefix("api/example-entity")]
    // Add the "AllowAnonymous" attribute to the class
    [AllowAnonymous]
    // declare a public class named ExampleEntityController that inherits from ApiController
    public class ExampleEntityController : ApiController
    {
        // declare a private readonly field named exampleEntityService of type IExampleEntityService
        readonly IExampleEntityService exampleEntityService;

        // declare a public constructor that takes one parameter of type IExampleEntityService
        public ExampleEntityController(IExampleEntityService exampleEntityService)
        {
            // assign the parameter exampleEntityService to the field exampleEntityService
            this.exampleEntityService = exampleEntityService;
        }

        // Add the Route and HttpGet attributes to the GetAll method
        [Route, HttpGet]
        // declare a public method named GetAll that takes no parameters and returns an instance of  HttpResponseMessage
        public HttpResponseMessage GetAll()
        {
            // 1. declare a variable named itemsResponse of type ItemsResponse<ExampleEntity>
            // 2. create a new instance of ItemsResponse<ExampleEntity>
            // 3. store the new instance into the variable
            ItemsResponse<ExampleEntity> itemsResponse = new ItemsResponse<ExampleEntity>();

            // set the Items property of the itemsResponse variable to the result of calling
            // the GetAll method on exampleEntityService
            itemsResponse.Items = exampleEntityService.GetAll();

            // Call the CreateResponse method on the Request property (inherited from the parent class)
            // then return that response from this controller method.
            return Request.CreateResponse(HttpStatusCode.OK, itemsResponse);
        }

        [HttpGet, Route("{id:int}")]
        public HttpResponseMessage GetById(int id)
        {
            ItemResponse<ExampleEntity> itemResponse = new ItemResponse<ExampleEntity>();
            itemResponse.Item = exampleEntityService.GetById(id);

            return Request.CreateResponse(HttpStatusCode.OK, itemResponse);
        }

        [Route, HttpPost]
        public HttpResponseMessage Create(ExampleEntityCreateRequest req)
        {
            if (req == null)
            {
                ModelState.AddModelError("", "Missing body data.");
            }

            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }

            // Declare a variable of type "ItemResponse of int" named itemResponse,
            // then, create a new ItemResponse of int and put it into that variable.

            ItemResponse<int> itemResponse = new ItemResponse<int>();
            itemResponse.Item = exampleEntityService.Create(req);

            return Request.CreateResponse(HttpStatusCode.Created, itemResponse);
        }
    }
}