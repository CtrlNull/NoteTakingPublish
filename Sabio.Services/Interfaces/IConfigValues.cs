using Sabio.Models.Domain;
using Sabio.Models.Requests;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Sabio.Services.Interfaces
{
	public interface IConfigValues
	{
		List<ConfigValues> GetAll();
		ConfigValues GetById(int id);
		string GetByName(string name);
		int Create(ConfigValuesCreateRequest req);
		void Update(ConfigValuesUpdateRequest req);
		void Delete(int id);
	}
}
