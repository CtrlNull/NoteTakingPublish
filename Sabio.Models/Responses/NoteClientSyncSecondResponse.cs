using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Responses
{
    public class NoteClientSyncSecondResponse
    {
        //	SELECT note_guid, revision, user_id, parent_note_id, content, date_created, date_modified
        public string Note_Guid { get; set; }
        public int Revision { get; set; }
        public int User_Id { get; set; }
        public string Parent_Note_Id { get; set; }
        public string Content { get; set; }
        public DateTime Date_Created { get; set; }
        public DateTime Date_Modified { get; set; }
    }
}
