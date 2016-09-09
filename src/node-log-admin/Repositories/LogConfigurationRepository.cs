using Newtonsoft.Json;
using node_log_admin.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace node_log_admin.Repositories
{
    public class LogConfigurationRepository : ILogConfigurationRepository
    {
        private readonly ApplicationDbContext _dbContext;

        public LogConfigurationRepository(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<bool> AddAsync(LogConfiguration data)
        {
            _dbContext.LogConfiguration.Add(data);

            return await _dbContext.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteAsync(string hostname)
        {
            LogConfiguration config = Get(hostname);

            return await DeleteAsync(config);
        }

        public async Task<bool> DeleteAsync(LogConfiguration data)
        {
            _dbContext.LogConfiguration.Remove(data);

            return await _dbContext.SaveChangesAsync() > 0;
        }

        public LogConfiguration Get(string hostname)
        {
            return _dbContext.LogConfiguration.FirstOrDefault(lc => lc.Hostname.Equals(hostname));
        }

        public IEnumerable<LogConfiguration> GetAll()
        {
            return _dbContext.LogConfiguration.AsEnumerable();
        }

        public async Task<bool> UpdateAsync(string hostname, IEnumerable<ColumnConfiguration> data)
        {
            LogConfiguration config = Get(hostname);
            config.Configuration = await Task.Factory.StartNew(() => JsonConvert.SerializeObject(data));
            _dbContext.LogConfiguration.Update(config);

            return await _dbContext.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateAsync(LogConfiguration data)
        {
            _dbContext.LogConfiguration.Update(data);

            return await _dbContext.SaveChangesAsync() > 0;
        }

        public async Task<bool> AddOrUpdateAsync(string hostname, IEnumerable<ColumnConfiguration> data)
        {
            LogConfiguration config = Get(hostname);

            if (config != null)
            {
                config.Configuration = await Task.Factory.StartNew(() => JsonConvert.SerializeObject(data));
                return await UpdateAsync(config);
            }

            config = new LogConfiguration()
            {
                Hostname = hostname,
                Configuration = await Task.Factory.StartNew(() => JsonConvert.SerializeObject(data))
            };

            return await AddAsync(config);
        }
    }
}
