using Application.Common.Interfaces.Queries;
using Domain.DashboardStatistics;
using Domain.DashboardStatistics.DashboardStatistics;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DashboardStatistics.Queries
{
    public sealed record GetDashboardStatisticByIdQuery(Guid Id)
            : IRequest<Option<DashboardStatistic>>;
    public sealed class GetDashboardStatisticByIdQueryHandler(
        IDashboardStatisticQueries queries)
        : IRequestHandler<GetDashboardStatisticByIdQuery, Option<DashboardStatistic>>
    {
        public async Task<Option<DashboardStatistic>> Handle(
            GetDashboardStatisticByIdQuery request,
            CancellationToken cancellationToken)
        {
            var id = new DashboardStatisticsId(request.Id);
            return await queries.GetByIdAsync(id, cancellationToken);
        }
    }
}
