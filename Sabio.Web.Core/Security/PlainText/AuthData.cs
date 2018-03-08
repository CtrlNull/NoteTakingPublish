using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Security;

namespace Sabio.Web.Core.Security.PlainText
{
    public class AuthData
    {
        public IEnumerable<SimpleClaim> OtherClaims { get; private set; }
        public IEnumerable<string> Roles { get; private set; }
        public string UserId { get; private set; }
        public string UserName { get; private set; }

        public AuthData(string userId, string userName, IEnumerable<string> roles, IEnumerable<SimpleClaim> otherClaims)
        {
            UserId = userId;
            UserName = userName;
            this.Roles = roles;
            OtherClaims = otherClaims;
        }

        public override string ToString()
        {

            string formatted =  string.Format(
                  "{0}~{1}~{2}~{3}",
                  UserId,
                  UserName,
                  string.Join("__", Roles),
                  string.Join("__", OtherClaims.Select(c => c.Type + "," + c.Value))
              );

            return formatted;


        }

    }
}
