using Sabio.Models.Domain;
using Sabio.Models.Requests;
using System.Collections.Generic;

namespace Sabio.Services.Interfaces
{
    // declare a public interface named IExampleEntityService
    public interface IExampleEntityService
    {
        // declare the method signatures that must be present in any class that claims to implement IExampleEntityService

        List<ExampleEntity> GetAll();
        int Create(ExampleEntityCreateRequest request);
        ExampleEntity GetById(int id);
    }
}
