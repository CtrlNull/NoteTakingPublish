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
	[RoutePrefix("api/configValues"), AllowAnonymous]
	public class ConfigValuesController : ApiController
	{
		readonly IConfigValues ConfigValuesService;
		public ConfigValuesController(IConfigValues ConfigValuesService)
		{
			this.ConfigValuesService = ConfigValuesService;
		}

		[Route, HttpGet, AllowAnonymous]
		public HttpResponseMessage GetAll()
		{
			ItemsResponse<ConfigValues> itemsResponse = new ItemsResponse<ConfigValues>();
			itemsResponse.Items = ConfigValuesService.GetAll();
			HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, itemsResponse); // another example as above ^^^a
			return response;
		}

		[HttpGet, Route("{id:int}")]
		public HttpResponseMessage GetById(int id)
		{
			ItemResponse<ConfigValues> itemResponse = new ItemResponse<ConfigValues>();
			itemResponse.Item = ConfigValuesService.GetById(id);
			return Request.CreateResponse(HttpStatusCode.OK, itemResponse);

		}

		[HttpPost, Route]
		public HttpResponseMessage Create(ConfigValuesCreateRequest req)
		{
			if (req == null) 
			{
				ModelState.AddModelError("", "missing Body Data.");
			}
			if (!ModelState.IsValid)
			{
				return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
			}
			ItemResponse<int> itemResponse = new ItemResponse<int>(); 
			itemResponse.Item = ConfigValuesService.Create(req);
			return Request.CreateResponse(HttpStatusCode.Created, itemResponse);
		}
		[HttpPut, Route("{id:int}")]
		public HttpResponseMessage Update(ConfigValuesUpdateRequest req)
		{
			if (req == null)
			{
				ModelState.AddModelError("", "Missing Something."); // 
			}
			if (!ModelState.IsValid)
			{
				return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
			}
			ConfigValuesService.Update(req);
			return Request.CreateResponse(HttpStatusCode.OK, new SuccessResponse());
		}

		[HttpDelete, Route("{id:int}")]

		public HttpResponseMessage Delete(int id)
		{
			ConfigValuesService.Delete(id);
			return Request.CreateResponse(HttpStatusCode.OK, new SuccessResponse());
		}
	}
}

