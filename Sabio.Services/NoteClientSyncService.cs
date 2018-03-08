using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Sabio.Models.Domain;
using Sabio.Services.Interfaces;
using Sabio.Models.Responses;
using Sabio.Data.Providers;
using System.Data.SqlClient;
using Sabio.Data;
using System.Data;
using Sabio.Models.Requests;

namespace Sabio.Services
{
    public class NoteClientSyncService : INoteClientSyncService
    {
        readonly IDataProvider dataProvider;

        public NoteClientSyncService(IDataProvider dataProvider)
        {
            this.dataProvider = dataProvider;
        }

        public List<TagsGetAllResponse> TagsGetAll()
        {
            List<TagsGetAllResponse> results = null;
            dataProvider.ExecuteCmd(
                "tag_getall",
                inputParamMapper: null,
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    if (results == null)
                    {
                        results = new List<TagsGetAllResponse>();
                    }

                    TagsGetAllResponse result = new TagsGetAllResponse();
                    result.Name = reader.GetString(0);
                    result.Date_Created = reader.GetDateTime(1);
                    result.Date_Modified = reader.GetDateTime(2);

                    results.Add(result);
                });
            return results;
        }

        public List<NoteClientSyncFirstResponse> FirstRequest(NoteClientSyncFirstRequest reqModel)
        {
            List<NoteClientSyncFirstResponse> results = new List<NoteClientSyncFirstResponse>();
            this.dataProvider.ExecuteCmd(
                "note_client_sync",
                inputParamMapper: delegate (SqlParameterCollection paramCollection)
                {
                    var tags = reqModel.Tags;

                    if (tags.Length != 0)
                    {

                        var p = paramCollection.AddWithValue("@Tags", new NVarcharTable(tags));
                        p.SqlDbType = System.Data.SqlDbType.Structured;
                        p.TypeName = "dbo.NVarCharTable";

                    }

                    paramCollection.AddWithValue("@Date_Min", reqModel.Date_Min ?? (object)DBNull.Value);
                    paramCollection.AddWithValue("@Date_Max", reqModel.Date_Max ?? (object)DBNull.Value);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    NoteClientSyncFirstResponse result = new NoteClientSyncFirstResponse();
                    result.Note_Guid = reader.GetString(0);

                    results.Add(result);
                });
            return results;
        }

        public List<NoteClientSyncSecondResponse> SecondRequest(NoteClientSyncSecondRequest reqModel)
        {
            List<NoteClientSyncSecondResponse> results = new List<NoteClientSyncSecondResponse>();
            this.dataProvider.ExecuteCmd(
                "note_client_sync_query",
                inputParamMapper: delegate (SqlParameterCollection paramCollection)
                {
                    var guid = reqModel.Note_Guid;

                    var p = paramCollection.AddWithValue("@Query", new NVarcharTable(guid));
                    p.SqlDbType = System.Data.SqlDbType.Structured;
                    p.TypeName = "dbo.NVarCharTable";
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    NoteClientSyncSecondResponse result = new NoteClientSyncSecondResponse();
                    result.Note_Guid = reader.GetString(0);
                    result.Revision = reader.GetInt32(1);
                    result.User_Id = reader.GetInt32(2);
                    result.Parent_Note_Id = reader.GetString(3);
                    result.Content = reader.GetString(4);
                    result.Date_Created = reader.GetDateTime(5);
                    result.Date_Modified = reader.GetDateTime(6);

                    results.Add(result);
                });

            return results;
        }

    }
}