using Sabio.Models;
using Sabio.Models.Requests;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services.Interfaces
{
    public interface IBackupService
    {
        List<GlobalNoteId> SyncNotes(NoteBackupRequest request);
        void UpdateNotes(string request);
    }
}
