using Application.Common.Interfaces.Queries;
using Domain.Needs;
using Domain.Needs.Importance;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Needs.Queries
{
    public sealed record GetNeedsByImportanceQuery(Guid ImportanceId)
            : IRequest<IReadOnlyList<Need>>;
    public sealed class GetNeedsByImportanceQueryHandler(
        INeedQueries queries)
        : IRequestHandler<GetNeedsByImportanceQuery, IReadOnlyList<Need>>
    {
        public async Task<IReadOnlyList<Need>> Handle(
            GetNeedsByImportanceQuery request,
            CancellationToken cancellationToken)
        {
            var importanceId = new NeedImportanceId(request.ImportanceId);
            return await queries.GetByImportanceAsync(importanceId, cancellationToken);
        }
    }
}
