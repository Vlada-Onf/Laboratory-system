using Application.Common.Interfaces.Queries;
using Application.Common.Interfaces.Repositories;
using Domain.Components;
using Domain.Components.Comment;
using LanguageExt;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories
{
    public class ComponentCommentRepository(ApplicationDbContext context)
            : IComponentCommentRepository, IComponentCommentQueries
    {
        public async Task<ComponentComment> AddAsync(ComponentComment comment, CancellationToken cancellationToken)
        {
            await context.ComponentComments.AddAsync(comment, cancellationToken);
            await context.SaveChangesAsync(cancellationToken);
            return comment;
        }

        public async Task<ComponentComment> UpdateAsync(ComponentComment comment, CancellationToken cancellationToken)
        {
            context.ComponentComments.Update(comment);
            await context.SaveChangesAsync(cancellationToken);
            return comment;
        }

        public async Task<ComponentComment> DeleteAsync(ComponentComment comment, CancellationToken cancellationToken)
        {
            context.ComponentComments.Remove(comment);
            await context.SaveChangesAsync(cancellationToken);
            return comment;
        }

        public async Task<Option<ComponentComment>> GetByIdAsync(ComponentCommentId id, CancellationToken cancellationToken)
        {
            var entity = await context.ComponentComments
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.Id == id, cancellationToken);

            return entity ?? Option<ComponentComment>.None;
        }

        public async Task<IReadOnlyList<ComponentComment>> GetByComponentIdAsync(ComponentId componentId, CancellationToken cancellationToken)
        {
            return await context.ComponentComments
                .AsNoTracking()
                .Where(c => c.ComponentId == componentId)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync(cancellationToken);
        }
    }
}
