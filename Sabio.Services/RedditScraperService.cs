using Sabio.Models.Domain;
using System.Collections.Generic;
using AngleSharp;
using Sabio.Data.Providers;

namespace Sabio.Services
{
    public class RedditScraperService
    {

        // 1. create a readonly field to hold the injected thing
        readonly IDataProvider dataProvider;

        // 2. create a contructor and ask for that thing(s) as parameter

        public RedditScraperService(IDataProvider dataProvider)
        {
            // 3. store the parameter in the field
            this.dataProvider = dataProvider;
        } 

        public List<RedditPost> GetFrontPage(string subReddit)
        {
            var config = Configuration.Default.WithDefaultLoader();
            var address = "https://www.reddit.com/r" + "/" + subReddit;
            var document = BrowsingContext.New(config).OpenAsync(address).Result;
            var newList = new List<RedditPost>();
            var table = document.QuerySelector("#siteTable");
            foreach (var post in table.QuerySelectorAll(".thing"))
            {
                var title = post.QuerySelector("a.title");

                var blogTitle = title.TextContent;

                var urlLink = post.QuerySelector("a.title")
                    .GetAttribute("href");

                RedditPost result = new RedditPost();
                result.Title = blogTitle;
                result.Url = urlLink;
                newList.Add(result);

            }
            return newList;

        }
    }
}
