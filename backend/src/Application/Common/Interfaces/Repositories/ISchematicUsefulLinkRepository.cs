using Domain.Schematics.Schematics;
using Domain.Schematics.UsefulLink;

namespace Application.Common.Interfaces.Repositories
{
    public interface ISchematicUsefulLinkRepository
    {
        Task<SchematicUsefulLink> AddAsync(SchematicUsefulLink link, CancellationToken ct);
        Task<SchematicUsefulLink> UpdateAsync(SchematicUsefulLink link, CancellationToken ct);
        Task<SchematicUsefulLink> DeleteAsync(SchematicUsefulLink link, CancellationToken ct);

        Task<LanguageExt.Option<SchematicUsefulLink>> GetByIdAsync(SchematicUsefulLinkId id, CancellationToken ct);
        Task<IReadOnlyList<SchematicUsefulLink>> GetBySchematicIdAsync(SchematicId schematicId, CancellationToken ct);
    }
}
