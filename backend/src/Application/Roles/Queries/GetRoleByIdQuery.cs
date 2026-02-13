using Application.Common.Interfaces.Queries;
using Domain.Roles;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Roles.Queries
{
    public sealed record GetRoleByIdQuery(Guid Id)
            : IRequest<Option<Role>>;
    public sealed class GetRoleByIdQueryHandler(
        IRoleQueries queries)
        : IRequestHandler<GetRoleByIdQuery, Option<Role>>
    {
        public async Task<Option<Role>> Handle(
            GetRoleByIdQuery request,
            CancellationToken cancellationToken)
        {
            var id = new RoleId(request.Id);
            return await queries.GetByIdAsync(id, cancellationToken);
        }
    }
}
