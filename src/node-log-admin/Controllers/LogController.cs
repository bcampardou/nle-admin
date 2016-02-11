using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;
using Microsoft.AspNet.Authorization;
using node_log_admin.Tools;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNet.Mvc.Filters;

// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace node_log_admin.Controllers
{
    [Authorize]
    public class LogController : Controller
    {

        // GET: /<controller>/
        [Route("log")]
        public IActionResult Index(string hostname)
        {
            ViewBag.MenuItem = string.IsNullOrWhiteSpace(hostname) ? MenuItems.Log : hostname;
            ViewBag.hostname = hostname;
            return View();
        }
    }
}
