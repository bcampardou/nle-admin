using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using node_log_admin.Tools;

namespace node_log_admin.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            ViewBag.MenuItem = MenuItems.Home;
            return View();
        }

        public IActionResult About()
        {
            ViewBag.MenuItem = MenuItems.Home;
            ViewData["Message"] = "Your application description page.";

            return View();
        }

        public IActionResult Contact()
        {
            ViewBag.MenuItem = MenuItems.Home;
            ViewData["Message"] = "Your contact page.";

            return View();
        }

        public IActionResult Error()
        {
            ViewBag.MenuItem = MenuItems.Home;
            return View();
        }
    }
}
