using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace node_log_admin.Models
{
    public class ColumnConfiguration
    {
        public string name { get; set; }
        public bool isHidden { get; set; }
        public EnumFilterType filterType { get; set; }

        public ColumnConfiguration()
        {

        }
    }
}
