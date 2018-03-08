using Sabio.Models.Domain;
using Sabio.Models.Responses;
using System.Collections.Generic;
using Sabio.Models.Requests;

namespace Sabio.Services.Interfaces
{
    public interface INoteClientSyncService
    {
        List<NoteClientSyncFirstResponse> FirstRequest(NoteClientSyncFirstRequest reqModel);
        List<NoteClientSyncSecondResponse> SecondRequest(NoteClientSyncSecondRequest reqModel);
        List<TagsGetAllResponse> TagsGetAll();
    }
}