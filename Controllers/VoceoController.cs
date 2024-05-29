using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using LinePatrol.Models;

namespace LinePatrol.Controllers;

public class VoceoController : Controller
{
     public IActionResult Index()
    {
        return View();
    }
}