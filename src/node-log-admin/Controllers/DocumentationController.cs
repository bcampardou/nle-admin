﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;
using node_log_admin.Tools;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNet.Mvc.Filters;

// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace node_log_admin.Controllers
{
    public class DocumentationController : Controller
    {

        // GET: /<controller>/
        public IActionResult Index()
        {
            ViewBag.MenuItem = MenuItems.Documentation;
            return View();
        }
    }
}