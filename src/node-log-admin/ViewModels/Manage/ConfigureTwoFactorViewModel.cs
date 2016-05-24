using Microsoft.AspNetCore.Mvc.Rendering;
using System.Collections.Generic;

namespace node_log_admin.ViewModels.Manage
{
    public class ConfigureTwoFactorViewModel
    {
        public string SelectedProvider { get; set; }

        public ICollection<SelectListItem> Providers { get; set; }
    }
}
