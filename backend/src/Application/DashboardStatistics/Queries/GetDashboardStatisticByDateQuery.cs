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
    public sealed record GetDashboardStatisticByDateQuery(DateTime Date)
        : IRequest<Option<DashboardStatistic>>;
    public sealed class GetDashboardStatisticByDateQueryHandler(
        IDashboardStatisticQueries queries)
        : IRequestHandler<GetDashboardStatisticByDateQuery, Option<DashboardStatistic>>
    {
        public async Task<Option<DashboardStatistic>> Handle(
            GetDashboardStatisticByDateQuery request,
            CancellationToken cancellationToken)
        {
            return await queries.GetByDateAsync(request.Date, cancellationToken);
        }
    }
}
