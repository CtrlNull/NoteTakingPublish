using Newtonsoft.Json.Linq;
using Sabio.Models.Domain;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Net;
using System.Web;

namespace Sabio.Services
{
    public class StackOverflowService
    {


        public List<StackOverflow> SearchStackOverflow(string title)
        {
            string myUrl = "https://api.stackexchange.com/2.2/search/excerpts?order=desc&sort=activity&accepted=True&site=stackoverflow&title=" + HttpUtility.UrlEncode(title);
            var client = new WebClient();
            client.Headers[HttpRequestHeader.AcceptEncoding] = "gzip";
            var responseStream = new GZipStream(client.OpenRead(myUrl), CompressionMode.Decompress);
            var reader = new StreamReader(responseStream);
            var textResponse = reader.ReadToEnd();
            var newList = new List<StackOverflow>();
            JObject stackTitles = JObject.Parse(textResponse);
            foreach (JObject stack in stackTitles["items"])
            {
                StackOverflow result = new StackOverflow();
                result.Title = stack.Value<string>("title");
                result.Body = stack.Value<string>("body");
                result.QuestionId = stack.Value<int>("question_id");
                newList.Add(result);
            }
            return newList;
        }
    }
}
