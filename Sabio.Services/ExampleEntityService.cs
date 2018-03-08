using Sabio.Data.Providers;
using Sabio.Models.Domain;
using Sabio.Models.Requests;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services
{
    // declare a public class named ExampleEntityService that implements the IExampleEntityService interface
    public class ExampleEntityService : IExampleEntityService
    {
        // 1. create a readonly field to hold the injected thing
        readonly IDataProvider dataProvider;

        // 2. create a contructor and ask for that thing(s) as parameter
        public ExampleEntityService(IDataProvider dataProvider)
        {
            // 3. store the parameter in the field
            this.dataProvider = dataProvider;
        }

        public int Create(ExampleEntityCreateRequest request)
        {
            int id = 0;

            /*
            
            // This is the plain-vanilla ADO.NET version of the dataProvider call below

            using (SqlConnection con = new SqlConnection("..."))
            {
                con.Open();

                SqlCommand cmd = con.CreateCommand();
                cmd.CommandText = "example_entity__create"; // #1
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@stuff", request.Stuff); // #2 cmd.Parameters.AddWithValue("@thing", request.Thing);
                SqlParameter idParam = cmd.Parameters.Add("@id", SqlDbType.Int);
                idParam.Direction = ParameterDirection.Output;

                cmd.ExecuteNonQuery();

                id = (int)cmd.Parameters["@id"].Value; // #3
            }

            return id;
            */

            dataProvider.ExecuteNonQuery(
                "example_entity__create", // #1
                inputParamMapper: delegate (SqlParameterCollection parameters)
                {
                    /*
                    Here's the long version of:
                    parameters.AddWithValue("@stuff", request.Stuff);

                    SqlParameter stuffParam;
                    stuffParam = new SqlParameter();
                    stuffParam.ParameterName = "@stuff";
                    stuffParam.Value = request.Stuff;
                    stuffParam.Direction = ParameterDirection.Input;
                    parameters.Add(stuffParam);
                    */

                    parameters.AddWithValue("@stuff", request.Stuff); // #2
                    parameters.AddWithValue("@thing", request.Thing);

                    SqlParameter idParam = parameters.Add("@id", SqlDbType.Int);
                    idParam.Direction = ParameterDirection.Output;
                },
                returnParameters: delegate (SqlParameterCollection parameters)
                {
                    id = (int)parameters["@id"].Value; // #3

                    // do NOT do this:
                    // int.TryParse(parameters["@id"].Value.ToString(), out id);
                });

            return id;
        }

        public List<ExampleEntity> GetAll()
        {
            List<ExampleEntity> results = null;

            dataProvider.ExecuteCmd(
                "example_entity__getall",
                inputParamMapper: null,
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    if (results == null)
                    {
                        results = new List<ExampleEntity>();
                    }

                    // In English this means:
                    // create a new variable called result that can hold an object of type
                    // ExampleEntity. THEN, create a new instance of ExampleEntity and
                    // store it in that variable.
                    ExampleEntity result = new ExampleEntity();

                    result.Id = reader.GetInt32(0);
                    result.DateCreated = reader.GetDateTime(1);
                    result.DateModified = reader.GetDateTime(2);
                    result.Thing = reader.GetInt32(3);
                    result.Stuff = reader.GetString(4);

                    results.Add(result);
                });

            return results;
        }

        public ExampleEntity GetById(int id)
        {
            ExampleEntity result = null;

            /*
            
            // This is the plain-vanilla ADO.NET version of the dataProvider call below

            using (SqlConnection con = new SqlConnection("..."))
            {
                con.Open();

                SqlCommand cmd = con.CreateCommand();
                cmd.CommandText = "example_entity__getbyid"; // #1
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@id", id); // #2

                using (IDataReader reader = cmd.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        result = new ExampleEntity(); // #3
                        result.Id = id;
                        result.DateCreated = reader.GetDateTime(0);
                        result.DateModified = reader.GetDateTime(1);
                        result.Stuff = reader.GetString(2);
                        result.Thing = reader.GetInt32(3);
                    }
                }
            }

            return result;
            */

            dataProvider.ExecuteCmd(
                "example_entity__getbyid", // #1
                inputParamMapper: delegate (SqlParameterCollection parameters)
                {
                    parameters.AddWithValue("@id", id); // #2
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    result = new ExampleEntity(); // #3
                    result.Id = reader.GetInt32(0);
                    result.DateCreated = reader.GetDateTime(1);
                    result.DateModified = reader.GetDateTime(2);
                    result.Stuff = reader.GetString(3);
                    result.Thing = reader.GetInt32(4);
                }
            );

            return result;
        }
    }
}
