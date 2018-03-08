using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Requests;
using Sabio.Services.Interfaces;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace Sabio.Services
{
    public class BackupService : IBackupService
    {

        readonly IDataProvider dataProvider;

        public BackupService(IDataProvider dataProvider)
        {
            this.dataProvider = dataProvider;
        }


        public List<GlobalNoteId> SyncNotes(NoteBackupRequest request)
        {
            List<GlobalNoteId> results = new List<GlobalNoteId>();

            dataProvider.ExecuteCmd(
                "note_check_remote",
                inputParamMapper: delegate (SqlParameterCollection parameters)
                {
                    var noteRevisionTable = parameters.AddWithValue("Notes", new GlobalNoteIdTable(request.GlobalNoteIds));
                    noteRevisionTable.SqlDbType = SqlDbType.Structured;
                    noteRevisionTable.TypeName = "dbo.NoteRevisionTable";
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    if (results == null)
                    {
                        results = new List<GlobalNoteId>();
                    }

                    GlobalNoteId result = new GlobalNoteId();
                    result.NoteGuid = reader.GetString(0);
                    result.Revision = reader.GetInt32(1);

                    results.Add(result);
                });

            return results;
        }

        public void UpdateNotes(string request)
        {
            dataProvider.ExecuteNonQuery(
                "note_update_remote",
                inputParamMapper: delegate (SqlParameterCollection parameters)
                {
                    var noteUpdateRequest = parameters.AddWithValue("json", request);
                });
        }
    }
}
