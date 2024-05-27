using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using LinePatrol.Models;

namespace LinePatrol.Controllers;

public class VoseoController : Controller
{
     public IActionResult Index()
    {
        return View();
    }
}