using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests
{
    public class UserBaseLoginRequest
    {
        [Required]
        [MinLength(1)]
        public string Login { get; set; }

        [Required]
        [MinLength(1)]
        public string Password { get; set; }
    }
}
