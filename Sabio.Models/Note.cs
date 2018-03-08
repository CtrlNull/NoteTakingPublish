using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models
{
    public class Note
    {
        public string Id { get; set; }
        public int Revision { get; set; }
        public string Type { get; set; }
        public object Body { get; set; }
        public List<string> Parents { get; set; }
        public string DateCreated { get; set; }
        public string DateModified { get; set; }
    }
}
