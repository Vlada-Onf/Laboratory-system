using Application.Tags.Exceptions;
using Domain.Tags;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Tags.Commands.Create
{
    public record CreateTagCommand : IRequest<Either<TagException, Tag>>
    {
        public required string Name { get; init; }
        public required string Color { get; init; }
        public required Guid CreatedBy { get; init; }
    }
}
