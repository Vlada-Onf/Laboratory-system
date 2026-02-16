using Application.Common.Interfaces.Queries;
using Domain.Needs;
using Domain.Needs.Status;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Needs.Queries
{
    public sealed record GetNeedsByStatusQuery(Guid StatusId)
            : IRequest<IReadOnlyList<Need>>;
    public sealed class GetNeedsByStatusQueryHandler(
        INeedQueries needQueries)
        : IRequestHandler<GetNeedsByStatusQuery, IReadOnlyList<Need>>
    {
        public async Task<IReadOnlyList<Need>> Handle(
            GetNeedsByStatusQuery request,
            CancellationToken cancellationToken)
        {
            var statusId = new NeedStatusId(request.StatusId);
            return await needQueries.GetByStatusAsync(statusId, cancellationToken);
        }
    }
}
