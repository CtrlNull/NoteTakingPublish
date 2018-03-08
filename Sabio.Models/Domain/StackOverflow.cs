using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain
{
    public class StackOverflow
    {
        public string Title { get; set; }
        public string Body { get; set; }
        public DateTime CreationDate { get; set; }
        public Boolean HasAcceptedAnswer { get; set; }
        public int QuestionId { get; set; }
    }
}
