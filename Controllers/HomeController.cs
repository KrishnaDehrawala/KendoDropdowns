using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using KendoDropdown.Repositories.Interfaces;
using KendoDropdown.Models;

namespace KendoCustom.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;
    public readonly IKendoDropdownInterface _drop;
    public HomeController(ILogger<HomeController> logger, IKendoDropdownInterface drop)
    {
        _logger = logger;
        _drop = drop;
    }

    public IActionResult Index()
    {
        return View();
    }

    public IActionResult Privacy()
    {
        return View();
    }
    public IActionResult DropdownDynamic()
    {
        return View();
    }

    public async Task<IActionResult> GetStates()
    {
        List<StateVM> stateList = await _drop.GetStates();
        return Json(stateList);
    }
    public async Task<IActionResult> GetMeCities([FromQuery] string stateid)
    {
        Console.WriteLine("Controller stateid: " + stateid);
        List<CityVM> cityList = await _drop.GetCities(stateid);
        return Json(cityList);
    }
    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
