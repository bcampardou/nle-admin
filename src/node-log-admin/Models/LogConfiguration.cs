using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace node_log_admin.Models
{
    public class LogConfiguration
    {
        [Key]
        public string Hostname { get; set; }

        public string Configuration { get; set; }
    }
}
