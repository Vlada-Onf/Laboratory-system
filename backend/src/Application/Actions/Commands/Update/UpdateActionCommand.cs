using Application.Actions.Exceptions;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Actions.Commands.Update
{
    public sealed record UpdateActionCommand
         : IRequest<Either<ActionException, Action>>
    {
        public required Guid Id { get; init; }
        public required string Name { get; init; }
        public string? Description { get; init; }
    }
}
