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
        IDashboardStatisticRepository statisticRepository)
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
                var statistic = DashboardStatistic.Create(
                    statisticDate: request.StatisticDate,
                    totalComponentsCount: request.TotalComponentsCount,
                    totalComponentsCost: request.TotalComponentsCost,
                    totalDecommissionedCount: request.TotalDecommissionedCount);

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