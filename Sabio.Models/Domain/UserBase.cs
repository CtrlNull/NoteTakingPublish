using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain
{
    public class UserBase : IUserAuthData
    {
        public int Id { get; set; }

        public DateTime DateCreated { get; set; }

        public DateTime DateModified { get; set; }

        public string EmailAddress { get; set; }

        public string UserName { get; set; }

        public string FullName { get; set; }

        // this comes from the user_group table in the database
        public IEnumerable<string> Roles { get; set; }
    }
}
