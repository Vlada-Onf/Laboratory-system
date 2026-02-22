using Application.Schematics.Exceptions;
using Domain.Schematics;
using LanguageExt;
using MediatR;

namespace Application.Schematics.Commands.Create
{
    public sealed record CreateSchematicCommand
        : IRequest<Either<SchematicException, Schematic>>
    {
        public required Guid ComponentId { get; init; }
        public required string Title { get; init; }
        public string? Description { get; init; }
        public string? PhotoUrl { get; init; }
        public string? DocumentUrl { get; init; }
        public Guid? UsefulLinkId { get; init; }
        public required Guid CreatedBy { get; init; }
    }
}


