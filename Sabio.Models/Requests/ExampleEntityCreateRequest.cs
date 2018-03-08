using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests
{
    public class ExampleEntityCreateRequest
    {
        [Required]
        [MinLength(1), MaxLength(50)]
        public string Stuff { get; set; }

        public int Thing { get; set; }
    }
}
