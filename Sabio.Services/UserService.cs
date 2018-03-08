using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests;
using Sabio.Services.Cryptography;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services
{
    public class UserService : IUserService
    {
        // 1. create a readonly field to hold the injected thing
        private IAuthenticationService _authenticationService;
        private ICryptographyService _cryptographyService;
        private IDataProvider _dataProvider;
        private const int HASH_ITERATION_COUNT = 1;
        private const int RAND_LENGTH = 15;

        // 2. create a contructor and ask for that thing(s) as parameter
        public UserService(IAuthenticationService authService, ICryptographyService cryptographyService, IDataProvider dataProvider)
        {
            // 3. store the parameter in the field
            _authenticationService = authService;
            _dataProvider = dataProvider;
            _cryptographyService = cryptographyService;
        }



        // Login operations
        public bool LogIn(UserBaseLoginRequest request)
        {
            bool isSuccessful = false;

            string salt = GetSalt(request.Login);

            if (!String.IsNullOrEmpty(salt))
            {
                string passwordHash = _cryptographyService.Hash(request.Password, salt, HASH_ITERATION_COUNT);

                IUserAuthData response = Get(request.Login, passwordHash);

                if (response != null)
                {
                    // create the cookie that is set for the user
                    _authenticationService.LogIn(response);
                    isSuccessful = true;
                }
            }

            return isSuccessful;
        }

        public bool LogInTest(string email, string password, int id, string[] roles = null)
        {
            bool isSuccessful = false;

            IUserAuthData response = new UserBase
            {
                Id = id
                ,
                FullName = "FakeUser" + id.ToString()
                ,
                Roles = roles ?? new[] { "User", "Super", "Content Manager" }
            };

            Claim tenant = new Claim("Tenant", "AAAA");
            Claim fullName = new Claim("FullName", "Sabio Bootcamp");

            //Login Supports multiple claims
            //and multiple roles is a good and quick example to set up for one-to-many relationships
            _authenticationService.LogIn(response, new Claim[] { tenant, fullName });

            return isSuccessful;

        }

        /// <summary>
        /// Gets the Data call to get a given user
        /// </summary
        /// <param name="email"></param>
        /// <param name="passwordHash"></param>
        /// <returns></returns>
        private IUserAuthData Get(string login, string passwordHash)
        {
            UserBase userAuthData = new UserBase();

                _dataProvider.ExecuteCmd(
                    "user_getauthdata",
                    inputParamMapper: delegate (SqlParameterCollection parameters)
                    {
                        parameters.AddWithValue("@Login", login);
                        parameters.AddWithValue("@Password", passwordHash);
                    },
                    singleRecordMapper: delegate (IDataReader reader, short set)
                    {
                        userAuthData.Id = reader.GetInt32(0);
                        userAuthData.FullName = reader.GetString(1);
                        //userAuthData.Roles = // <== how do I get the roles from dbo.user_group?
                    }
                );

            return userAuthData;
        }

        /// <summary>
        /// The Dataprovider call to get the Salt for User with the given UserName/Email
        /// </summary>
        /// <param name="email"></param>
        /// <returns></returns>
        private string GetSalt(string login)
        {
            string salt = "";

            _dataProvider.ExecuteCmd(
                "user_getsalt",
                inputParamMapper: delegate (SqlParameterCollection parameters)
                {
                    parameters.AddWithValue("@Login", login);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    salt = reader.GetString(0);
                });

            return salt;
        }



        // CRUD operations
        public int Create(UserBaseCreateRequest request)
        {
            int id = 0;
            string salt;
            string passwordHash;
            string password = request.Password; // Get from user model when you have a concrete class

            salt = _cryptographyService.GenerateRandomString(RAND_LENGTH);
            passwordHash = _cryptographyService.Hash(password, salt, HASH_ITERATION_COUNT);

            try
            {
                //DB provider call to create user and get us a user id
                _dataProvider.ExecuteNonQuery(
                    "user_create",
                    inputParamMapper: delegate (SqlParameterCollection parameters)
                    {
                    // if the thing on the left is 'null' use the thing on the right
                    parameters.AddWithValue("@FullName", request.FullName ?? (object)DBNull.Value);
                        parameters.AddWithValue("@Username", request.UserName);
                        parameters.AddWithValue("@EmailAddress", request.EmailAddress);
                        parameters.AddWithValue("@Password", passwordHash);
                        parameters.AddWithValue("@Salt", salt);

                        SqlParameter idParam = parameters.Add("@Id", SqlDbType.Int);
                        idParam.Direction = ParameterDirection.Output;
                    },
                    returnParameters: delegate (SqlParameterCollection parameters)
                    {
                        id = (int)parameters["@Id"].Value;
                    });
                //be sure to store both salt and passwordHash
                //DO NOT STORE the original password value that the user passed us
            }
            catch (SqlException exception) when (exception.Number == 2627)
            {
                throw new DuplicateNameException("A user with that user name or email address already exists.");
            }

            return id;
        }

        public List<UserBase> GetAll()
        {
            List<UserBase> results = null;

            _dataProvider.ExecuteCmd(
                "user_getall",
                inputParamMapper: null,
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    if (results == null)
                    {
                        results = new List<UserBase>();
                    }

                    UserBase result = new UserBase();

                    result.Id = reader.GetInt32(0);
                    result.DateCreated = reader.GetDateTime(1);
                    result.DateModified = reader.GetDateTime(2);
                    result.EmailAddress = reader.GetString(3);
                    result.UserName = reader.GetString(4);
                    result.FullName = reader.GetSafeString(5);

                    results.Add(result);
                });

            return results;
        }

        public UserBase GetById(int id)
        {
            UserBase result = new UserBase();

            _dataProvider.ExecuteCmd(
                "user_getbyid",
                inputParamMapper: delegate (SqlParameterCollection parameters)
                {
                    parameters.AddWithValue("@Id", id);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    result.Id = reader.GetInt32(0);
                    result.DateCreated = reader.GetDateTime(1);
                    result.DateModified = reader.GetDateTime(2);
                    result.EmailAddress = reader.GetString(3);
                    result.UserName = reader.GetString(4);
                    result.FullName = reader.GetSafeString(5);
                });

            return result;
        }

        public int Update(UserBaseUpdateRequest request)
        {
            _dataProvider.ExecuteNonQuery(
                "user_update",
                inputParamMapper: delegate (SqlParameterCollection parameters)
                {
                    parameters.AddWithValue("@Id", request.Id);
                    parameters.AddWithValue("@FullName", request.FullName);
                    parameters.AddWithValue("@UserName", request.UserName);
                    parameters.AddWithValue("@EmailAddress", request.EmailAddress);
                });

            return request.Id;
        }

        public int Delete(int id)
        {
            _dataProvider.ExecuteNonQuery(
                "user_delete",
                inputParamMapper: delegate (SqlParameterCollection parameters)
                {
                    parameters.AddWithValue("@Id", id);
                });

            return id;
        }
    }
}
