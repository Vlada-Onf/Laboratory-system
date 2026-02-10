using Application.Common.Interfaces.Queries;
using Application.Common.Interfaces.Repositories;
using Domain.DashboardStatistics;
using Domain.DashboardStatistics.DashboardStatistics;
using LanguageExt;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories
{
    public class DashboardStatisticRepository : IDashboardStatisticRepository, IDashboardStatisticQueries
    {
        private readonly ApplicationDbContext _context;

        public DashboardStatisticRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<DashboardStatistic> AddAsync(DashboardStatistic statistic, CancellationToken cancellationToken)
        {
            await _context.DashboardStatistics.AddAsync(statistic, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
            return statistic;
        }

        public async Task<DashboardStatistic> UpdateAsync(DashboardStatistic statistic, CancellationToken cancellationToken)
        {
            _context.DashboardStatistics.Update(statistic);
            await _context.SaveChangesAsync(cancellationToken);
            return statistic;
        }

        public async Task<Option<DashboardStatistic>> GetByDateAsync(DateTime date, CancellationToken cancellationToken)
        {
            var statistic = await _context.DashboardStatistics
                .FirstOrDefaultAsync(ds => ds.StatisticDate.Date == date.Date, cancellationToken);

            return statistic ?? Option<DashboardStatistic>.None;
        }

        public async Task<Option<DashboardStatistic>> GetByIdAsync(DashboardStatisticsId id, CancellationToken cancellationToken)
        {
            var statistic = await _context.DashboardStatistics
                .AsNoTracking()
                .FirstOrDefaultAsync(ds => ds.Id == id, cancellationToken);

            return statistic ?? Option<DashboardStatistic>.None;
        }

        public async Task<IReadOnlyList<DashboardStatistic>> GetAllAsync(CancellationToken cancellationToken)
        {
            return await _context.DashboardStatistics
                .AsNoTracking()
                .OrderByDescending(ds => ds.StatisticDate)
                .ToListAsync(cancellationToken);
        }

        public async Task<IReadOnlyList<DashboardStatistic>> GetByDateRangeAsync(
            DateTime startDate,
            DateTime endDate,
            CancellationToken cancellationToken)
        {
            return await _context.DashboardStatistics
                .AsNoTracking()
                .Where(ds => ds.StatisticDate >= startDate && ds.StatisticDate <= endDate)
                .OrderBy(ds => ds.StatisticDate)
                .ToListAsync(cancellationToken);
        }

        public async Task<Option<DashboardStatistic>> GetLatestAsync(CancellationToken cancellationToken)
        {
            var statistic = await _context.DashboardStatistics
                .AsNoTracking()
                .OrderByDescending(ds => ds.StatisticDate)
                .FirstOrDefaultAsync(cancellationToken);

            return statistic ?? Option<DashboardStatistic>.None;
        }
    }
}
