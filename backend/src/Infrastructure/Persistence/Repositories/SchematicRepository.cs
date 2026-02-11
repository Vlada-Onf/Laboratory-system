using Application.Common.Interfaces.Queries;
using Application.Common.Interfaces.Repositories;
using Domain.Components;
using Domain.Schematics;
using Domain.Schematics.Schematics;
using LanguageExt;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories
{
    public class SchematicRepository(ApplicationDbContext context)
        : ISchematicRepository, ISchematicQueries
    {
        public async Task<Schematic> AddAsync(Schematic schematic, CancellationToken cancellationToken)
        {
            await context.Schematics.AddAsync(schematic, cancellationToken);
            await context.SaveChangesAsync(cancellationToken);
            return schematic;
        }

        public async Task<Schematic> UpdateAsync(Schematic schematic, CancellationToken cancellationToken)
        {
            context.Schematics.Update(schematic);
            await context.SaveChangesAsync(cancellationToken);
            return schematic;
        }

        public async Task<Schematic> DeleteAsync(Schematic schematic, CancellationToken cancellationToken)
        {
            context.Schematics.Remove(schematic);
            await context.SaveChangesAsync(cancellationToken);
            return schematic;
        }

        public async Task<Option<Schematic>> GetByIdAsync(SchematicId id, CancellationToken cancellationToken)
        {
            var entity = await context.Schematics
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.Id == id, cancellationToken);

            return entity ?? Option<Schematic>.None;
        }

        public async Task<IReadOnlyList<Schematic>> GetByComponentIdAsync(ComponentId componentId, CancellationToken cancellationToken)
        {
            return await context.Schematics
                .AsNoTracking()
                .Where(s => s.ComponentId == componentId)
                .ToListAsync(cancellationToken);
        }
    }
}
