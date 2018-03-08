using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Sabio.Data;

namespace Sabio.Models.Requests
{
    public class NoteClientSyncFirstRequest
    {
        [Required]
        public string[] Tags { get; set; }

        public DateTime? Date_Min { get; set; }
        public DateTime? Date_Max { get; set; }
    }
}
