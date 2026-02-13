using Application.Common.Interfaces.Queries;
using Application.Common.Interfaces.Repositories;
using Application.DashboardStatistics.Exceptions;
using Domain.DashboardStatistics;
using Domain.DashboardStatistics.DashboardStatistics;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DashboardStatistics.Commands.Update
{
    public sealed class UpdateDashboardStatisticCommandHandler(
           IDashboardStatisticRepository statisticRepository,
           IComponentQueries componentQueries,
           IDamagedComponentQueries damagedComponentQueries)
           : IRequestHandler<UpdateDashboardStatisticCommand, Either<DashboardStatisticException, DashboardStatistic>>
    {
        public async Task<Either<DashboardStatisticException, DashboardStatistic>> Handle(
            UpdateDashboardStatisticCommand request,
            CancellationToken cancellationToken)
        {
            var id = new DashboardStatisticsId(request.Id);
            var option = await statisticRepository.GetByIdAsync(id, cancellationToken);

            return await option.MatchAsync(
                Some: stat => UpdateEntity(stat, cancellationToken),
                None: () => Task.FromResult<Either<DashboardStatisticException, DashboardStatistic>>(
                    new DashboardStatisticNotFoundException(id)));
        }

        private async Task<Either<DashboardStatisticException, DashboardStatistic>> UpdateEntity(
            DashboardStatistic statistic,
            CancellationToken cancellationToken)
        {
            try
            {
                var components = await componentQueries.GetAllAsync(cancellationToken);
                var totalComponentsCount = components.Count;
                var totalComponentsCost = components.Sum(c => c.TotalCost);

                var damaged = await damagedComponentQueries.GetAllAsync(cancellationToken);
                var totalDecommissionedCount = damaged.Sum(d => d.Quantity);

                statistic.Update(
                    totalComponentsCount: totalComponentsCount,
                    totalComponentsCost: totalComponentsCost,
                    totalDecommissionedCount: totalDecommissionedCount);

                var updated = await statisticRepository.UpdateAsync(statistic, cancellationToken);

                return updated;
            }
            catch (Exception ex)
            {
                return new UnhandledDashboardStatisticException(statistic.Id, ex);
            }
        }
    }
}