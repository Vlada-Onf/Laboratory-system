using Application.SchematicsUsefulLinks.Exceptions;
using Domain.Schematics.UsefulLink;
using LanguageExt;
using MediatR;

namespace Application.SchematicsUsefulLinks.Commands.Create
{
    public sealed record CreateSchematicUsefulLinkCommand
            : IRequest<Either<SchematicUsefulLinkException, SchematicUsefulLink>>
    {
        public required Guid SchematicId { get; init; }
        public required string Title { get; init; }
        public required string Url { get; init; }
        public required Guid CreatedBy { get; init; }
        public required Guid PerformedBy { get; init; }
    }
}
