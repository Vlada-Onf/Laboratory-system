using Domain.Schematics;
using Domain.Schematics.Schematics;
using LanguageExt;

namespace Application.Common.Interfaces.Repositories
{
    public interface ISchematicRepository
    {
        Task<Schematic> AddAsync(Schematic schematic, CancellationToken cancellationToken);
        Task<Schematic> UpdateAsync(Schematic schematic, CancellationToken cancellationToken);
        Task<Schematic> DeleteAsync(Schematic schematic, CancellationToken cancellationToken);

        Task<Option<Schematic>> GetByIdAsync(SchematicId id, CancellationToken cancellationToken);
    }
}
