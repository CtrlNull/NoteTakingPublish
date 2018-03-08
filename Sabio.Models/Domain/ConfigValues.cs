using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain
{
	//public is to let the class be used in other projects if its not public it can only be used in the project its in
	public class ConfigValues
	{
		// model container to hold the data
		public int Id { get; set; }
		public string Name { get; set; }
		public string Values { get; set; }
	}
}
