using Sabio.Models.Domain;
using Sabio.Models.Requests;
using System.Collections.Generic;

namespace Sabio.Services
{
    public interface IUserService
    {
        int Create(UserBaseCreateRequest request);
        bool LogIn(UserBaseLoginRequest request);
        bool LogInTest(string email, string password, int id, string[] roles = null);

        List<UserBase> GetAll();
        UserBase GetById(int id);
        int Update(UserBaseUpdateRequest request);
        int Delete(int id);
    }
}