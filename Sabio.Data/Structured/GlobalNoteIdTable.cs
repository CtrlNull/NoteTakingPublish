using Microsoft.SqlServer.Server;
using Sabio.Models;
using System.Collections.Generic;
using System.Data;

namespace Sabio.Data
{
    public class GlobalNoteIdTable : IEnumerable<SqlDataRecord>
    {

        private IEnumerable<GlobalNoteId> _items;

        public GlobalNoteIdTable(IEnumerable<GlobalNoteId> items)
        {
            _items = items;
        }


        private static SqlDataRecord GetRecord()
        {
            return new SqlDataRecord(
                new SqlMetaData[]
                {
                    new SqlMetaData("note_guid", SqlDbType.NVarChar, 100),
                    new SqlMetaData("revision", SqlDbType.Int)
                }
            );
        }

        public IEnumerator<SqlDataRecord> GetEnumerator()
        {
            if (_items != null)
            {
                foreach (GlobalNoteId item in _items)
                {
                    var rec = GetRecord();
                    rec.SetString(0, item.NoteGuid);
                    rec.SetInt32(1, item.Revision);
                    yield return rec;
                }
            }

            yield break;
        }

        System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
        {
            return GetEnumerator();
        }
    }
}
