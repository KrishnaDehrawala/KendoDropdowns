using KendoDropdown.Models;

namespace KendoDropdown.Repositories.Interfaces
{
    public interface IKendoDropdownInterface
    {
        Task<List<StateVM>> GetStates();
        Task<List<CityVM>> GetCities(string stateid);
    }
}