using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KendoDropdown.Models
{
    public class StateVM
    {
        public int StateId { get; set; }
        public string? StateName { get; set; }
        public CityVM? CityVM { get; set; }
    }
}