using Application.Users.Exceptions;
using Domain.Users;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Users.Commands.Update
{
    public record UpdateUserByAdminCommand : IRequest<Either<UserException, User>>
    {
        public required Guid Id { get; init; }

        public string? FirstName { get; init; }
        public string? LastName { get; init; }
        public Guid? RoleId { get; init; }
        public bool? IsActive { get; init; }

        public required Guid PerformedBy { get; init; }
    }
}
