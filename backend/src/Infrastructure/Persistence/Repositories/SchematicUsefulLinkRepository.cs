using Application.Common.Interfaces.Queries;
using Application.Common.Interfaces.Repositories;
using Domain.Schematics.Schematics;
using Domain.Schematics.UsefulLink;
using Infrastructure.Persistence;
using LanguageExt;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public sealed class SchematicUsefulLinkRepository
        : ISchematicUsefulLinkRepository, ISchematicUsefulLinkQueries
    {
        private readonly ApplicationDbContext _db;

        public SchematicUsefulLinkRepository(ApplicationDbContext db)
        {
            _db = db;
        }

        public async Task<SchematicUsefulLink> AddAsync(
            SchematicUsefulLink link,
            CancellationToken ct)
        {
            _db.SchematicUsefulLinks.Add(link);
            await _db.SaveChangesAsync(ct);
            return link;
        }

        public async Task<SchematicUsefulLink> UpdateAsync(
            SchematicUsefulLink link,
            CancellationToken ct)
        {
            _db.SchematicUsefulLinks.Update(link);
            await _db.SaveChangesAsync(ct);
            return link;
        }

        public async Task<SchematicUsefulLink> DeleteAsync(
            SchematicUsefulLink link,
            CancellationToken ct)
        {
            _db.SchematicUsefulLinks.Remove(link);
            await _db.SaveChangesAsync(ct);
            return link;
        }

        public async Task<Option<SchematicUsefulLink>> GetByIdAsync(
            SchematicUsefulLinkId id,
            CancellationToken ct)
        {
            var entity = await _db.SchematicUsefulLinks
                .FirstOrDefaultAsync(x => x.Id == id, ct);

            return entity is null
                ? Option<SchematicUsefulLink>.None
                : Option<SchematicUsefulLink>.Some(entity);
        }

        public async Task<IReadOnlyList<SchematicUsefulLink>> GetBySchematicIdAsync(
            SchematicId schematicId,
            CancellationToken ct)
        {
            return await _db.SchematicUsefulLinks
                .Where(x => x.SchematicId == schematicId)
                .ToListAsync(ct);
        }
    }
}
