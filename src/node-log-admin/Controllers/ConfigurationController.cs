using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Specialized;
using node_log_admin.Models;
using Microsoft.Extensions.Logging;
using node_log_admin.Repositories;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace node_log_admin.Controllers
{
    [Route("api/configuration")]
    public class ConfigurationController : Controller
    {
        private ILogConfigurationRepository _RepoConfigurations { get; set; }

        public ConfigurationController(ILogConfigurationRepository repoConfigurations)
        {
            _RepoConfigurations = repoConfigurations;
        }

        // GET: api/values
        [HttpGet]
        public IEnumerable<LogConfiguration> Get()
        {
            return _RepoConfigurations.GetAll();
        }

        // GET api/values/5
        [HttpGet("{hostname}")]
        public string Get([FromRoute]string hostname)
        {
            return _RepoConfigurations.Get(hostname.Trim()).Configuration;
        }

        // POST api/values
        [HttpPost("{hostname}")]
        public async Task<IActionResult> Post([FromRoute]string hostname, [FromBody]List<ColumnConfiguration> data)
        {
            return await _RepoConfigurations.AddOrUpdateAsync(hostname, data) ? (IActionResult)Ok(data) : BadRequest(data);
        }

        // PUT api/values/5
        [HttpPut("{hostname}")]
        public async Task<IActionResult> Put([FromRoute]string hostname, [FromBody]List<ColumnConfiguration> data)
        {
            return await _RepoConfigurations.AddOrUpdateAsync(hostname, data) ? (IActionResult)Ok(data) : BadRequest(data);
        }

        // DELETE api/values/5
        [HttpDelete("{hostname}")]
        public async Task<IActionResult> Delete([FromRoute]string hostname)
        {
            return await _RepoConfigurations.DeleteAsync(hostname) ? (IActionResult)Ok() : BadRequest();
        }
    }
}
