using Application.Common.Interfaces.Queries;
using Domain.Needs;
using Domain.Users;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Needs.Queries
{
    public sealed record GetNeedsByUserQuery(Guid UserId)
        : IRequest<IReadOnlyList<Need>>;
    public sealed class GetNeedsByUserQueryHandler(
        INeedQueries queries)
        : IRequestHandler<GetNeedsByUserQuery, IReadOnlyList<Need>>
    {
        public async Task<IReadOnlyList<Need>> Handle(
            GetNeedsByUserQuery request,
            CancellationToken cancellationToken)
        {
            var userId = new UserId(request.UserId);
            return await queries.GetByUserAsync(userId, cancellationToken);
        }
    }
}
