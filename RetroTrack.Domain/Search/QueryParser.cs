using RetroTrack.Domain.Search.Enum;
using RetroTrack.Domain.Search.QueryParamaters;

namespace RetroTrack.Domain.Search
{
    public static class QueryParser
    {
        public static QueryData ParseData(string q)
        {
            var data = new QueryData();

            var parameters = q.ToLower().Split(' ');

            // parameters syntax is {command}{operator}{exclude?}{value}
            foreach (var parameter in parameters)
            {
                if (parameter.Contains(":"))
                {
                    // is includes or excluses condition
                    var parts = parameter.Split(':');

                    if(parts.Length != 2)
                    {
                        continue;
                    }

                    var isExcludes = parts[1].StartsWith("!");

                    if(isExcludes) 
                    {
                        parts[1] = parts[1].Substring(1);
                    }

                    try
                    {
                        switch (parts[0])
                        {
                            case "name":
                                data.NameFilters.Add(new NameFilter
                                {
                                    Value = parts[1],
                                    FilterType = isExcludes ? Enum.IncludeExcludeEnum.Excludes : Enum.IncludeExcludeEnum.Includes
                                });
                                break;

                            case "ach":
                                data.AchievementCountFilters.Add(new AchievementCountFilter
                                {
                                    Value = long.Parse(parts[1]),
                                    FilterType = isExcludes ? NumberFilterEnum.NotEqualTo : NumberFilterEnum.EqualTo
                                });
                                break;
                            default:
                                break;
                        }
                    }
                    catch
                    {
                        continue;
                    }


                }
                else
                {
                    var numberFilterEnum = NumberFilterEnum.NotEqualTo;
                    string[] command;

                    if (parameter.Contains(">="))
                    {
                        numberFilterEnum = NumberFilterEnum.GreaterThanOrEqualTo;
                        command = parameter.Split(">=");
                    }
                    else if (parameter.Contains("<="))
                    {
                        numberFilterEnum = NumberFilterEnum.LessThanOrEqualTo;
                        command = parameter.Split("<=");
                    }
                    else if (parameter.Contains("!="))
                    {
                        numberFilterEnum = NumberFilterEnum.NotEqualTo;
                        command = parameter.Split("!=");
                    }
                    else if (parameter.Contains("="))
                    {
                        numberFilterEnum = NumberFilterEnum.EqualTo;
                        command = parameter.Split("=");
                    }
                    else if (parameter.Contains(":"))
                    {
                        numberFilterEnum = NumberFilterEnum.EqualTo;
                        command = parameter.Split(":");
                    }
                    else if (parameter.Contains("<"))
                    {
                        numberFilterEnum = NumberFilterEnum.LessThan;
                        command = parameter.Split("<");
                    }
                    else if (parameter.Contains(">"))
                    {
                        numberFilterEnum = NumberFilterEnum.GreaterThan;
                        command = parameter.Split(">");
                    }
                    else
                    {
                        continue;
                    }

                    try
                    {
                        switch (command[0])
                        {
                            case "ach":
                                data.AchievementCountFilters.Add(new AchievementCountFilter
                                {
                                    Value = long.Parse(command[1]),
                                    FilterType = numberFilterEnum
                                });
                                break;
                            default:
                                break;
                        }
                    }
                    catch
                    {
                        continue;
                    }

                }
            }

            return data;
        }
    }
}
