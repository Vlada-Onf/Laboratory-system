using Application.Tags.Exceptions;
using Domain.Tags;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Tags.Commands.Update
{
    public record UpdateTagCommand : IRequest<Either<TagException, Tag>>
    {
        public required Guid Id { get; init; }
        public required string Name { get; init; }
        public required string Color { get; init; }
        public required Guid PerformedBy { get; init; }
    }
}
