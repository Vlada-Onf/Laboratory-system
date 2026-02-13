using Application.Common.Interfaces.Queries;
using Application.Common.Interfaces.Repositories;
using Domain.Components;
using Domain.Tags;
using LanguageExt;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories
{
    public class TagRepository : ITagRepository, ITagQueries
    {
        private readonly ApplicationDbContext _context;

        public TagRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<IReadOnlyList<Tag>> GetByIdsAsync(
            List<Guid> tagIds,
            CancellationToken cancellationToken)
        {
            if (tagIds is null || tagIds.Count == 0)
                return Array.Empty<Tag>();

            var ids = tagIds
                .Where(id => id != Guid.Empty)
                .Distinct()
                .ToHashSet();

            var allTags = await _context.Tags
                .AsNoTracking()
                .ToListAsync(cancellationToken);

            return allTags
                .Where(t => ids.Contains(t.Id.Value))
                .ToList();
        }

        public async Task<Tag> AddAsync(Tag tag, CancellationToken cancellationToken)
        {
            await _context.Tags.AddAsync(tag, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
            return tag;
        }

        public async Task<Tag> UpdateAsync(Tag tag, CancellationToken cancellationToken)
        {
            _context.Tags.Update(tag);
            await _context.SaveChangesAsync(cancellationToken);
            return tag;
        }

        public async Task<Tag> DeleteAsync(Tag tag, CancellationToken cancellationToken)
        {
            _context.Tags.Remove(tag);
            await _context.SaveChangesAsync(cancellationToken);
            return tag;
        }

        public async Task<Option<Tag>> GetByIdAsync(TagId id, CancellationToken cancellationToken)
        {
            var tag = await _context.Tags
                .FirstOrDefaultAsync(t => t.Id == id, cancellationToken);

            return tag ?? Option<Tag>.None;
        }
        public async Task<IReadOnlyList<Tag>> GetByComponentAsync(ComponentId componentId, CancellationToken cancellationToken)
        {
            return await _context.Components
                .AsNoTracking()
                .Where(c => c.Id == componentId)
                .SelectMany(c => c.Tags)
                .ToListAsync(cancellationToken);
        }
        public async Task<IReadOnlyList<Tag>> GetAllAsync(CancellationToken cancellationToken)
        {
            return await _context.Tags
                .AsNoTracking()
                .ToListAsync(cancellationToken);
        }
    }
}
