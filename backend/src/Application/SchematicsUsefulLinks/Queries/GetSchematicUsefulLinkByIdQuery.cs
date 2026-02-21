using Application.Common.Interfaces.Queries;
using Domain.Schematics.Schematics;
using Domain.Schematics.UsefulLink;
using LanguageExt;
using MediatR;

namespace Application.SchematicsUsefulLinks.Queries
{
    public sealed record GetSchematicUsefulLinkByIdQuery(Guid Id)
        : IRequest<Option<SchematicUsefulLink>>;

    public sealed record GetSchematicUsefulLinksBySchematicIdQuery(Guid SchematicId)
        : IRequest<IReadOnlyList<SchematicUsefulLink>>;

    public sealed class GetSchematicUsefulLinkByIdQueryHandler(
        ISchematicUsefulLinkQueries queries)
        : IRequestHandler<GetSchematicUsefulLinkByIdQuery, Option<SchematicUsefulLink>>
    {
        public Task<Option<SchematicUsefulLink>> Handle(
            GetSchematicUsefulLinkByIdQuery request,
            CancellationToken ct)
        {
            var id = new SchematicUsefulLinkId(request.Id);
            return queries.GetByIdAsync(id, ct);
        }
    }

    public sealed class GetSchematicUsefulLinksBySchematicIdQueryHandler(
        ISchematicUsefulLinkQueries queries)
        : IRequestHandler<GetSchematicUsefulLinksBySchematicIdQuery, IReadOnlyList<SchematicUsefulLink>>
    {
        public Task<IReadOnlyList<SchematicUsefulLink>> Handle(
            GetSchematicUsefulLinksBySchematicIdQuery request,
            CancellationToken ct)
        {
            var schematicId = new SchematicId(request.SchematicId);
            return queries.GetBySchematicIdAsync(schematicId, ct);
        }
    }
}
