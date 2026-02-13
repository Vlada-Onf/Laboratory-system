using Application.EntityTypes.Exceptions;
using Domain.History.EntityTypes;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.EntityTypes.Commands.Create
{
    public sealed record CreateEntityTypeCommand
         : IRequest<Either<EntityTypeException, EntityType>>
    {
        public required string Name { get; init; }
        public string? Description { get; init; }
    }
}
