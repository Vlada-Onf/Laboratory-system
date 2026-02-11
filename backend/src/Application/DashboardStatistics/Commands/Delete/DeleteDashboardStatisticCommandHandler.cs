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

namespace Application.DashboardStatistics.Commands.Delete
{
    public sealed class DeleteDashboardStatisticCommandHandler(
        IDashboardStatisticRepository statisticRepository)
        : IRequestHandler<DeleteDashboardStatisticCommand, Either<DashboardStatisticException, DashboardStatistic>>
    {
        public async Task<Either<DashboardStatisticException, DashboardStatistic>> Handle(
            DeleteDashboardStatisticCommand request,
            CancellationToken cancellationToken)
        {
            var id = new DashboardStatisticsId(request.Id);
            var option = await statisticRepository.GetByIdAsync(id, cancellationToken);

            return await option.MatchAsync(
                Some: stat => DeleteEntity(stat, cancellationToken),
                None: () => Task.FromResult<Either<DashboardStatisticException, DashboardStatistic>>(
                    new DashboardStatisticNotFoundException(id)));
        }

        private async Task<Either<DashboardStatisticException, DashboardStatistic>> DeleteEntity(
            DashboardStatistic statistic,
            CancellationToken cancellationToken)
        {
            try
            {
                var deleted = await statisticRepository.DeleteAsync(statistic, cancellationToken);
                return deleted;
            }
            catch (Exception ex)
            {
                return new UnhandledDashboardStatisticException(statistic.Id, ex);
            }
        }
    }
}