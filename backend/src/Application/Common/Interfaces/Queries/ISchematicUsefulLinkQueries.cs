using Domain.Schematics.Schematics;
using Domain.Schematics.UsefulLink;
using LanguageExt;

namespace Application.Common.Interfaces.Queries
{
    public interface ISchematicUsefulLinkQueries
    {
        Task<Option<SchematicUsefulLink>> GetByIdAsync(
            SchematicUsefulLinkId id,
            CancellationToken ct);

        Task<IReadOnlyList<SchematicUsefulLink>> GetBySchematicIdAsync(
            SchematicId schematicId,
            CancellationToken ct);
    }
}
