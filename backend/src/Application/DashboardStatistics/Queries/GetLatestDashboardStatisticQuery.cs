using Application.Common.Interfaces.Queries;
using Domain.DashboardStatistics;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DashboardStatistics.Queries
{
    public sealed record GetLatestDashboardStatisticQuery
        : IRequest<Option<DashboardStatistic>>;
    public sealed class GetLatestDashboardStatisticQueryHandler(
        IDashboardStatisticQueries queries)
        : IRequestHandler<GetLatestDashboardStatisticQuery, Option<DashboardStatistic>>
    {
        public async Task<Option<DashboardStatistic>> Handle(
            GetLatestDashboardStatisticQuery request,
            CancellationToken cancellationToken)
        {
            return await queries.GetLatestAsync(cancellationToken);
        }
    }
}
