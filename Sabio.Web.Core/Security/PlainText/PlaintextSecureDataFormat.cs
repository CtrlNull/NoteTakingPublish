using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using Microsoft.AspNet.Identity;
using Microsoft.Owin.Security;
using Sabio.Web.Core.Security;
using Sabio.Web.Core.Security.PlainText;
using Newtonsoft.Json;
using System.ComponentModel;

namespace Sabio.Web.Core.Services.Security
{
   

    public class PlaintextSecureDataFormat : ISecureDataFormat<AuthenticationTicket>
    {
        private static readonly string[] _specialTypes = new[]{
                                                                ClaimTypes.Role,
                                                                ClaimTypes.Name,
                                                                ClaimTypes.NameIdentifier,
                                                                "http://schemas.microsoft.com/accesscontrolservice/2010/07/claims/identityprovider"
                                                            };

        private static readonly string[] _splitChar = new[] { "__" };

        public string Protect(AuthenticationTicket data)
        {
            var roles = data.Identity.FindAll(ClaimTypes.Role).Select(c => c.Value);

            var otherCliams = data.Identity
                                        .FindAll(IsNotSpecialClaim)
                                            .Select(c =>  new SimpleClaim(c.Type , c.Value));

            AuthData auth = new AuthData(data.Identity.GetUserId(), data.Identity.GetUserName(), roles, otherCliams);

            string qsFormat = auth.ToString();

            
            return qsFormat;

        }


        public AuthenticationTicket Unprotect(string protectedText)
        {
            try
            {
                string[] parts = protectedText.Split(new string[] { "~" }, StringSplitOptions.None);
               
                List<Claim> claims = new List<Claim>();

                claims.Add(new Claim(ClaimTypes.NameIdentifier, parts[0]));
                claims.Add(new Claim(ClaimTypes.Name, parts[1]));
                claims.Add(new Claim("http://schemas.microsoft.com/accesscontrolservice/2010/07/claims/identityprovider", "ASP.NET Identity"));
                

                if (parts.Length > 2 && !String.IsNullOrWhiteSpace(parts[2]))
                {
                    foreach (string role in parts[2].Split(_splitChar, StringSplitOptions.RemoveEmptyEntries))
                    {
                        if (String.IsNullOrWhiteSpace(role)) { continue; }

                        claims.Add(new Claim(ClaimTypes.Role, role));
                    }
                }

                if (parts.Length > 3 && !String.IsNullOrWhiteSpace(parts[3]))
                {
                    foreach (string claim in parts[3].Split(_splitChar, StringSplitOptions.RemoveEmptyEntries))
                    {
                        string[] claimParts = claim.Split(',');
                        claims.Add(new Claim(claimParts[0], claimParts[1]));
                    }
                }

                AuthenticationTicket authenticationTicket = new AuthenticationTicket(
                    new ClaimsIdentity(
                        claims,
                        "ApplicationCookie",
                        ClaimsIdentity.DefaultNameClaimType,
                        ClaimsIdentity.DefaultRoleClaimType
                    ),
                    new AuthenticationProperties
                    {
                        ExpiresUtc = DateTimeOffset.MaxValue,
                        IssuedUtc = DateTimeOffset.UtcNow
                    }
                );

                return authenticationTicket;
            }
            catch{
                //leave this here so we work out the bugs. commit changes back to original repo please
                throw;
                //return null;
            }

        }




        private bool IsNotSpecialClaim(Claim claim)
        {
            return !_specialTypes.Contains(claim.Type);
        }


    }
}
