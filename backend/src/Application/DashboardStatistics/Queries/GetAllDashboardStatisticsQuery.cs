using Application.Common.Interfaces.Queries;
using Domain.DashboardStatistics;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DashboardStatistics.Queries
{
    public sealed record GetAllDashboardStatisticsQuery
        : IRequest<IReadOnlyList<DashboardStatistic>>;
    public sealed class GetAllDashboardStatisticsQueryHandler(
        IDashboardStatisticQueries queries)
        : IRequestHandler<GetAllDashboardStatisticsQuery, IReadOnlyList<DashboardStatistic>>
    {
        public async Task<IReadOnlyList<DashboardStatistic>> Handle(
            GetAllDashboardStatisticsQuery request,
            CancellationToken cancellationToken)
        {
            return await queries.GetAllAsync(cancellationToken);
        }
    }
}
