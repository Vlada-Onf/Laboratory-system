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

namespace Application.DashboardStatistics.Commands.Create
{
    public sealed class CreateDashboardStatisticCommandHandler(
            IDashboardStatisticRepository statisticRepository,
            IComponentQueries componentQueries,
            IDamagedComponentQueries damagedComponentQueries)
            : IRequestHandler<CreateDashboardStatisticCommand, Either<DashboardStatisticException, DashboardStatistic>>
    {
        public async Task<Either<DashboardStatisticException, DashboardStatistic>> Handle(
            CreateDashboardStatisticCommand request,
            CancellationToken cancellationToken)
        {
            var existing = await statisticRepository.GetByDateAsync(
                request.StatisticDate,
                cancellationToken);

            return await existing.MatchAsync(
                Some: _ => Task.FromResult<Either<DashboardStatisticException, DashboardStatistic>>(
                    new DashboardStatisticAlreadyExistForDateException(request.StatisticDate)),
                None: () => CreateEntity(request, cancellationToken));
        }

        private async Task<Either<DashboardStatisticException, DashboardStatistic>> CreateEntity(
            CreateDashboardStatisticCommand request,
            CancellationToken cancellationToken)
        {
            DashboardStatisticsId? id = null;

            try
            {
                var components = await componentQueries.GetAllAsync(cancellationToken);
                var totalComponentsCount = components.Sum(c => c.Quantity);
                var totalComponentsCost = components.Sum(c => c.Quantity * c.Price);

                var damaged = await damagedComponentQueries.GetAllAsync(cancellationToken);
                var totalDecommissionedCount = damaged.Sum(d => d.Quantity);

                var statistic = DashboardStatistic.Create(
                    statisticDate: request.StatisticDate,
                    totalComponentsCount: totalComponentsCount,
                    totalComponentsCost: totalComponentsCost,
                    totalDecommissionedCount: totalDecommissionedCount);

                id = statistic.Id;

                var created = await statisticRepository.AddAsync(statistic, cancellationToken);

                return created;
            }
            catch (Exception ex)
            {
                return new UnhandledDashboardStatisticException(
                    id ?? DashboardStatisticsId.Empty(),
                    ex);
            }
        }
    }
}