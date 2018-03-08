using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests
{
    public class NoteClientSyncSecondRequest
    {
        [Required]
        public IEnumerable<string> Note_Guid { get; set; }
    }
}
