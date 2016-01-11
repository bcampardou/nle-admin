using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace node_log_admin.Services
{
    public interface IEmailSender
    {
        Task SendEmailAsync(string email, string subject, string message);
    }
}
