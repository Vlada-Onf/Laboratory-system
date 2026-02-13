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
    public sealed record GetRoleByNameQuery(string Name)
            : IRequest<Option<Role>>;
    public sealed class GetRoleByNameQueryHandler(
        IRoleQueries queries)
        : IRequestHandler<GetRoleByNameQuery, Option<Role>>
    {
        public async Task<Option<Role>> Handle(
            GetRoleByNameQuery request,
            CancellationToken cancellationToken)
        {
            return await queries.GetByNameAsync(request.Name, cancellationToken);
        }
    }
}
