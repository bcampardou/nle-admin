using node_log_admin.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace node_log_admin.Repositories
{
    public interface ILogConfigurationRepository
    {
        IEnumerable<LogConfiguration> GetAll();

        LogConfiguration Get(string hostname);

        Task<bool> AddAsync(LogConfiguration data);

        Task<bool> UpdateAsync(string hostname, IEnumerable<ColumnConfiguration> data);

        Task<bool> UpdateAsync(LogConfiguration data);

        Task<bool> DeleteAsync(LogConfiguration data);

        Task<bool> DeleteAsync(string hostname);

        Task<bool> AddOrUpdateAsync(string hostname, IEnumerable<ColumnConfiguration> data);
    }
}
