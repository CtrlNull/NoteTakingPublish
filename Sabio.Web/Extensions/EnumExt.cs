using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Reflection;

namespace Sabio.Web
{
    public static class EnumExt
    {
        public static bool ParseEnum<TEnum>(this TEnum iEnum, string enumValue, out TEnum parsedValue) where TEnum : struct
        {
            bool result = false;
            parsedValue = default(TEnum);


            if (Enum.TryParse(enumValue, out parsedValue))
            {
                if (Enum.IsDefined(typeof(TEnum), parsedValue))
                {
                    result = true;
                }
            }

            return result;
        }


        public static Dictionary<string, Dictionary<string, object>>
        EnumByDisplay(this Type type, int minValue = 0)
        {
            if (!type.IsEnum) { throw new ArgumentException("Must be an Enum type", "type"); }

            Dictionary<string, Dictionary<string, object>> dict = Enum.GetValues(type).Cast<int>()
                .Where(v => v >= minValue)
                .ToDictionary(v => Enum.GetName(type, v), v =>
                {
                    string name = Enum.GetName(type, v);
                    string display = type.GetMember(name)
                        .First()
                        .GetCustomAttribute<DisplayAttribute>()
                        ?.GetName();

                    return new Dictionary<string, object>
                {
                    { "value", v },
                    { "displayName", display ?? name }
                };
                });

            return dict;
        }

        public static Dictionary<int, Dictionary<string, string>>
            EnumByName(this Type type, int minValue = 0)
        {
            if (!type.IsEnum) { throw new ArgumentException("Must be an Enum type", "type"); }

            Dictionary<int, Dictionary<string, string>> dict = new Dictionary<int, Dictionary<string, string>>();

            foreach (var item in Enum.GetValues(type))
            {
                int val = (int)item;
                if (val >= minValue)
                {
                    string enumerator = item.ToString();
                    string display = type.GetMember(enumerator)
                        .First()
                        .GetCustomAttribute<DisplayAttribute>()
                        ?.GetName();

                    dict.Add(val, new Dictionary<string, string>
                    {
                        { "name", enumerator },
                        { "displayName", display ?? enumerator }
                    });

                }
            }

            return dict;
        }
    }
}