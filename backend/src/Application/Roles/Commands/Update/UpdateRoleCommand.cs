using Application.Roles.Exceptions;
using Domain.Roles;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Roles.Commands.Update
{
    public sealed record UpdateRoleCommand
            : IRequest<Either<RoleException, Role>>
    {
        public required Guid Id { get; init; }
        public required string Name { get; init; }
    }
}
