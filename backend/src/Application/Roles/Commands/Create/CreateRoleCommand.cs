using Application.Roles.Exceptions;
using Domain.Roles;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Roles.Commands.Create
{
    public sealed record CreateRoleCommand
            : IRequest<Either<RoleException, Role>>
    {
        public required string Name { get; init; }
    }
}
