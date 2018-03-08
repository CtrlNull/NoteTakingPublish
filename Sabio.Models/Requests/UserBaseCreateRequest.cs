using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests
{
    public class UserBaseCreateRequest
    {
        [Required]
        [MinLength(1), MaxLength(100)]
        public string FullName { get; set; }

        [Required]
        [MinLength(1), MaxLength(100)]
        public string UserName { get; set; }

        [Required]
        [MinLength(1), MaxLength(1024)]
        public string EmailAddress { get; set; }

        // plaintext password to be hashed and salted
        [Required]
        [MinLength(1), MaxLength(64)]
        public string Password { get; set; }

        // this comes from the user_group table in the database
        //public IEnumerable<string> Roles
        //{
        //    get; set;
        //}

    }
}
