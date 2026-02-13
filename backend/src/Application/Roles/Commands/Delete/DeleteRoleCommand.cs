using Application.Roles.Exceptions;
using Domain.Roles;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Roles.Commands.Delete
{
    public sealed record DeleteRoleCommand(Guid Id)
            : IRequest<Either<RoleException, Role>>;
}
