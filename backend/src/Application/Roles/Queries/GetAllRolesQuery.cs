using Application.Common.Interfaces.Queries;
using Domain.Roles;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Roles.Queries
{
    public sealed record GetAllRolesQuery
        : IRequest<IReadOnlyList<Role>>;
    public sealed class GetAllRolesQueryHandler(
        IRoleQueries queries)
        : IRequestHandler<GetAllRolesQuery, IReadOnlyList<Role>>
    {
        public async Task<IReadOnlyList<Role>> Handle(
            GetAllRolesQuery request,
            CancellationToken cancellationToken)
        {
            return await queries.GetAllAsync(cancellationToken);
        }
    }
}
