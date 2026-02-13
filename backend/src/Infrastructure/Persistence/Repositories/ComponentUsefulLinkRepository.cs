using Application.Common.Interfaces.Queries;
using Application.Common.Interfaces.Repositories;
using Domain.Components;
using Domain.Components.UsefulLink;
using LanguageExt;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories
{
    public class ComponentUsefulLinkRepository(ApplicationDbContext context)
            : IComponentUsefulLinkRepository, IComponentUsefulLinkQueries
    {
        public async Task<ComponentUsefulLink> AddAsync(ComponentUsefulLink link, CancellationToken cancellationToken)
        {
            await context.ComponentUsefulLinks.AddAsync(link, cancellationToken);
            await context.SaveChangesAsync(cancellationToken);
            return link;
        }

        public async Task<ComponentUsefulLink> UpdateAsync(ComponentUsefulLink link, CancellationToken cancellationToken)
        {
            context.ComponentUsefulLinks.Update(link);
            await context.SaveChangesAsync(cancellationToken);
            return link;
        }

        public async Task<ComponentUsefulLink> DeleteAsync(ComponentUsefulLink link, CancellationToken cancellationToken)
        {
            context.ComponentUsefulLinks.Remove(link);
            await context.SaveChangesAsync(cancellationToken);
            return link;
        }

        public async Task<Option<ComponentUsefulLink>> GetByIdAsync(ComponentUsefulLinkId id, CancellationToken cancellationToken)
        {
            var entity = await context.ComponentUsefulLinks
                .AsNoTracking()
                .FirstOrDefaultAsync(l => l.Id == id, cancellationToken);

            return entity ?? Option<ComponentUsefulLink>.None;
        }

        public async Task<IReadOnlyList<ComponentUsefulLink>> GetByComponentIdAsync(ComponentId componentId, CancellationToken cancellationToken)
        {
            return await context.ComponentUsefulLinks
                .AsNoTracking()
                .Where(l => l.ComponentId == componentId)
                .OrderByDescending(l => l.CreatedAt)
                .ToListAsync(cancellationToken);
        }
    }
}
