using System.Collections.Specialized;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using node_log_admin.Tools;

// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace node_log_admin.Controllers
{
    [Authorize]
    [Route("log")]
    public class LogController : Controller
    {

        // GET: /<controller>/
        [Route("{hostname:host}")]
        public IActionResult Index(string hostname)
        {
            ViewBag.MenuItem = string.IsNullOrWhiteSpace(hostname) ? MenuItems.Log : hostname;
            ViewBag.hostname = hostname;
            return View();
        }

        [HttpPost]
        [Route("SaveLogConfiguration/{hostname:host}")]
        public object SaveLogConfiguration(string hostname, NameValueCollection config)
        {
            return null;
        }
    }
}
