using Sabio.Data.Providers;
using Sabio.Models.Domain;
using Sabio.Models.Requests;
using Sabio.Services.Interfaces;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace Sabio.Services
{
	public class ConfigValuesService : IConfigValues
	{

		readonly IDataProvider dataProvider; 										
		public ConfigValuesService(IDataProvider dataProvider) 
		{
			this.dataProvider = dataProvider;
		}

		public List<ConfigValues> GetAll()
		{
			List<ConfigValues> results = null;
			dataProvider.ExecuteCmd(
				"config_values_getAll", 
				inputParamMapper: null, 
				singleRecordMapper: delegate (IDataReader reader, short set)
				{
					if (results == null)
					{
						results = new List<ConfigValues>();
					}

					ConfigValues result = new ConfigValues();

					result.Id = reader.GetInt32(0);
					result.Name = reader.GetString(1);
					result.Values = reader.GetString(2);
					results.Add(result);
				});

			return results;
		}


		public ConfigValues GetById(int id)
		{
			ConfigValues result = null;
			dataProvider.ExecuteCmd(
				"config_values_getById",
				inputParamMapper: delegate (SqlParameterCollection parameters)
			   {
				   parameters.AddWithValue("@id", id);
			   },
				singleRecordMapper: delegate (IDataReader reader, short set)
				{
					result = new ConfigValues();
					result.Id = reader.GetInt32(0);
					result.Name = reader.GetString(1);
					result.Values = reader.GetString(2);
				});
			return result;

		}

			static Dictionary<string, string> configCache = new Dictionary<string, string>();


		public string GetByName(string name) 
		{

			lock (configCache) 
			{

				string result = null;

				if (configCache.TryGetValue(name, out result))
				{
					return result;
				}
				dataProvider.ExecuteCmd(
					"config_values_getByName",
					inputParamMapper: delegate (SqlParameterCollection parameters)
					{
						parameters.AddWithValue("@name", name);
					},
					singleRecordMapper: delegate (IDataReader reader, short set)
					{
                        result = reader.GetString(0);
					});

				configCache.Add(name, result);

				return result;
			}
		}

		public int Create(ConfigValuesCreateRequest req)
		{
			int id = 0;
			dataProvider.ExecuteNonQuery(
				"config_values_create",
				inputParamMapper: delegate (SqlParameterCollection parameters)
				{
					parameters.AddWithValue("@name", req.Name);
					parameters.AddWithValue("@value", req.Value);

					SqlParameter idParam = parameters.Add("@id", SqlDbType.Int);
					idParam.Direction = ParameterDirection.Output;
				},
				returnParameters: delegate (SqlParameterCollection parameters) 
				{
					id = (int)parameters["@id"].Value;
				});
			return id;
		}
		public void Update(ConfigValuesUpdateRequest req)
		{
			dataProvider.ExecuteNonQuery(
				"config_values_update",
				inputParamMapper: delegate (SqlParameterCollection parameters)
				{
					parameters.AddWithValue("@id", req.Id);
					parameters.AddWithValue("@name", req.Name);
					parameters.AddWithValue("@value", req.Value);
				});
		}


		public void Delete(int id)
		{
			dataProvider.ExecuteNonQuery(
				"config_values_delete",
				inputParamMapper: delegate (SqlParameterCollection parameters)
				{
					parameters.AddWithValue("@id", id);
				});
		}

	}
}
