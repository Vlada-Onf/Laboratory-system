using Application.Schematics.Exceptions;
using Domain.Schematics;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Schematics.Commands.Update
{
    public sealed record UpdateSchematicCommand
        : IRequest<Either<SchematicException, Schematic>>
    {
        public required Guid Id { get; init; }
        public required string Title { get; init; }
        public string? Description { get; init; }
        public string? PhotoUrl { get; init; }
        public string? DocumentUrl { get; init; }
        public string? AdditionalLinks { get; init; }
        public required Guid UpdatedBy { get; init; }
    }
}
