using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Sabio.Web
{
    public static class DictionaryExt
    {
        public static Dictionary<string, string> ToDictionary(this Enum @enum)
        {
            var type = @enum.GetType();
            return Enum.GetValues(type).Cast<int>().ToDictionary(e => e.ToString(), e => Enum.GetName(type, e));
        }


        public static Dictionary<string, string> ToDictionary<T>(this T @enum) where T: struct
        {
            var type = @enum.GetType();
            return Enum.GetValues(type).Cast<int>().ToDictionary(e => e.ToString(), e => Enum.GetName(type, e));
        }

        public static KeyValuePair<int, string>[] ToJsonDictionary<T>(this T @enum) where T : struct
        {
            var type = @enum.GetType();
            return Enum.GetValues(type).Cast<int>().Select(e => new
                KeyValuePair<int, string>(Convert.ToInt32(e.ToString()), Enum.GetName(type, e))).ToArray();
        }

        public static Dictionary<string, int > ToDictionary<T>(this T @enum, int minValue) where T : struct
        {
            var type = @enum.GetType();
            return Enum.GetValues(type).Cast<int>().Where(i => i >= minValue).ToDictionary(e => Enum.GetName(type, e),e =>  e);
        }

        public static Dictionary<int, string> ToDictionaryByValue<T>(this T @enum, int minValue = 0) where T : struct
        {
            Type type = @enum.GetType();

            Dictionary<int, string> dic = new Dictionary<int, string>();

            foreach (var item in Enum.GetValues(@enum.GetType()))

            {
                int val = (int)item;
                if (val >= minValue)
                {
                    if(!dic.ContainsKey(val))
                    {
                        dic.Add(val, item.ToString());
                    }
                }

            }

            return dic;
        }
    }
}