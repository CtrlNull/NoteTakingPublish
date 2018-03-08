using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;
using System.Web;
using System.Web.Mvc;

namespace Sabio.Web
{
    public static class HtmlHelperExt
    {
        private static JsonSerializerSettings _settings = null;

        static HtmlHelperExt()
        {
            _settings = new JsonSerializerSettings();
            _settings.Converters.Add(new KeyValuePairConverter());

            _settings.ContractResolver = new CamelCasePropertyNamesContractResolver();
        }

        public static IHtmlString RawJson(this HtmlHelper helper, object model)
        {
            string rValue = null;

            rValue = JsonConvert.SerializeObject(model, _settings);
            return helper.Raw(rValue);;
        }
    }
}