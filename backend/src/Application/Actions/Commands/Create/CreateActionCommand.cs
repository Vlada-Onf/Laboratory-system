using Application.Actions.Exceptions;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Actions.Commands.Create
{
    public sealed record CreateActionCommand
        : IRequest<Either<ActionException, Action>>
    {
        public required string Name { get; init; }
        public string? Description { get; init; }
        public Guid UserId { get; init; }
    }
}
