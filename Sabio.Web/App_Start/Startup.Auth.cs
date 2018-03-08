using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin;
using Microsoft.Owin.Security.Cookies;
using Owin;
using Sabio.Web.Core;
using Sabio.Web.Core.Services.Security;
using System;
using System.Configuration;
using System.Web;

namespace Sabio.Web
{
    public partial class Startup
    {
        // Sabio: this is a system generated file. Google the hell out of this file. it could kill you.

        // For more information on configuring authentication, please visit http://go.microsoft.com/fwlink/?LinkId=301864
        public void ConfigureAuth(IAppBuilder app)
        {
           

            CookieAuthenticationOptions cookieAuthenticationOptions = new CookieAuthenticationOptions();
            {
                cookieAuthenticationOptions.SlidingExpiration = true;
                cookieAuthenticationOptions.AuthenticationType = DefaultAuthenticationTypes.ApplicationCookie;
                cookieAuthenticationOptions.LoginPath = new PathString("/");
                cookieAuthenticationOptions.Provider = new CookieAuthenticationProvider
                {
                    OnApplyRedirect = ctx =>
                    {
                        if (!IsAjaxRequest(ctx.Request) && !IsApiRequest(ctx.Request))
                        {
                            ctx.Response.Redirect(ctx.RedirectUri);
                        }
                    }
                };
                cookieAuthenticationOptions.CookieName = "authentication";
                if (ConfigurationManager.AppSettings["UsePlaintextAuthCookie"] == "true")
                {
                    cookieAuthenticationOptions.TicketDataFormat = new PlaintextSecureDataFormat();
                };
                app.UseCookieAuthentication(cookieAuthenticationOptions);
            };

            app.UseExternalSignInCookie(DefaultAuthenticationTypes.ExternalCookie);

            // Enables the application to temporarily store user information when they are verifying the second factor in the two-factor authentication process.
            app.UseTwoFactorSignInCookie(DefaultAuthenticationTypes.TwoFactorCookie, TimeSpan.FromMinutes(5));

            // Enables the application to remember the second login verification factor such as phone or email.
            // Once you check this option, your second step of verification during the login process will be remembered on the device where you logged in from.
            // This is similar to the RememberMe option when you log in.
            app.UseTwoFactorRememberBrowserCookie(DefaultAuthenticationTypes.TwoFactorRememberBrowserCookie);

            // Uncomment the following lines to enable logging in with third party login providers
            //app.UseMicrosoftAccountAuthentication(
            //    clientId: "",
            //    clientSecret: "");

            //app.UseTwitterAuthentication(
            //   consumerKey: "",
            //   consumerSecret: "");

            //app.UseFacebookAuthentication(
            //   appId: "",
            //   appSecret: "");

            //app.UseGoogleAuthentication(new GoogleOAuth2AuthenticationOptions()
            //{
            //    ClientId = "",
            //    ClientSecret = ""
            //});
        }

        /*Sabio: this one method illustrates how one would tell if a given request
         was made as an Ajax request
         */
        private static bool IsAjaxRequest(IOwinRequest request)
        {
            IReadableStringCollection query = request.Query;
            if ((query != null) && (query["X-Requested-With"] == "XMLHttpRequest"))
            {
                return true;
            }
            IHeaderDictionary headers = request.Headers;
            return ((headers != null) && (headers["X-Requested-With"] == "XMLHttpRequest"));
        }

        /*Sabio: this one method illustrates how one would tell if a given request
         was made as an API endpoint instead of a view controller endpoint
         */
        private static bool IsApiRequest(IOwinRequest request)
        {
            string apiPath = VirtualPathUtility.ToAbsolute("~/api/");
            return request.Uri.LocalPath.StartsWith(apiPath);
        }
    }
}