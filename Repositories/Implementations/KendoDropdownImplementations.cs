using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using KendoDropdown.Models;
using KendoDropdown.Repositories.Interfaces;
using Npgsql;

namespace KendoDropdown.Repositories.Implementations
{
    public class KendoDropdownImplementations : IKendoDropdownInterface
    {
        private readonly NpgsqlConnection _conn;

        public KendoDropdownImplementations(NpgsqlConnection conn)
        {
            _conn = conn;
        }
        public async Task<List<StateVM>> GetStates()
        {
            List<StateVM> stateList = new List<StateVM>();
            try
            {
                await _conn.OpenAsync();
                string query = @"SELECT 
                c_stateid,
                c_statename
                FROM t_state";
                using (NpgsqlCommand cmd = new NpgsqlCommand(query, _conn))
                {
                    using (NpgsqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (reader.Read())
                        {
                            StateVM state = new StateVM()
                            {
                                StateId = Convert.ToInt32(reader["c_stateid"]),
                                StateName = reader["c_statename"].ToString(),
                                // CityVM = new CityVM()
                                // {
                                //     CityId = Convert.ToInt32(reader["c_cityid"]),
                                //     CityName = reader["c_cityname"].ToString()
                                // }
                            };
                            stateList.Add(state);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
                await _conn.CloseAsync();
            }
            return stateList;
        }
        public async Task<List<CityVM>> GetCities(string stateid)
        {
            Console.WriteLine("GetCities repo stateid: " + stateid);
            List<CityVM> cityList = new List<CityVM>();
            try
            {
                await _conn.OpenAsync();
                string query = @"SELECT 
                c_cityId,
                c_cityname
                FROM 
                t_city
                WHERE c_stateid=@c_stateid";
                using (NpgsqlCommand cmd = new NpgsqlCommand(query, _conn))
                {
                    cmd.Parameters.AddWithValue("@c_stateid", Convert.ToInt32(stateid));
                    using (NpgsqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (reader.Read())
                        {
                            CityVM city = new CityVM()
                            {
                                CityId = Convert.ToInt32(reader["c_cityid"]),
                                CityName = reader["c_cityname"].ToString()
                            };
                            cityList.Add(city);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
                await _conn.CloseAsync();
            }
            return cityList;
        }
    }
}