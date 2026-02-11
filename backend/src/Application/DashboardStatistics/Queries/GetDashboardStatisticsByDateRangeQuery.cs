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
    public sealed record GetDashboardStatisticsByDateRangeQuery(
            DateTime StartDate,
            DateTime EndDate)
            : IRequest<IReadOnlyList<DashboardStatistic>>;
    public sealed class GetDashboardStatisticsByDateRangeQueryHandler(
        IDashboardStatisticQueries queries)
        : IRequestHandler<GetDashboardStatisticsByDateRangeQuery, IReadOnlyList<DashboardStatistic>>
    {
        public async Task<IReadOnlyList<DashboardStatistic>> Handle(
            GetDashboardStatisticsByDateRangeQuery request,
            CancellationToken cancellationToken)
        {
            return await queries.GetByDateRangeAsync(
                request.StartDate,
                request.EndDate,
                cancellationToken);
        }
    }
}
