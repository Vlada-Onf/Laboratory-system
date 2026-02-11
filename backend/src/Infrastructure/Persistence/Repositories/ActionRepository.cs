using Application.Common.Interfaces.Repositories;
using Domain.History.Actions;
using LanguageExt;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories
{
    public class ActionRepository(ApplicationDbContext context) : IActionRepository
    {
        public async Task<Action> AddAsync(Action action, CancellationToken cancellationToken)
        {
            await context.Actions.AddAsync(action, cancellationToken);
            await context.SaveChangesAsync(cancellationToken);
            return action;
        }

        public async Task<Action> UpdateAsync(Action action, CancellationToken cancellationToken)
        {
            context.Actions.Update(action);
            await context.SaveChangesAsync(cancellationToken);
            return action;
        }

        public async Task<Option<Action>> GetByIdAsync(ActionId id, CancellationToken cancellationToken)
        {
            var entity = await context.Actions
                .AsNoTracking()
                .FirstOrDefaultAsync(a => a.Id == id, cancellationToken);

            return entity ?? Option<Action>.None;
        }

        public async Task<Option<Action>> GetByNameAsync(string name, CancellationToken cancellationToken)
        {
            var entity = await context.Actions
                .AsNoTracking()
                .FirstOrDefaultAsync(a => a.Name == name, cancellationToken);

            return entity ?? Option<Action>.None;
        }
        public async Task<IReadOnlyList<Action>> GetAllAsync(CancellationToken cancellationToken)
        {
            return await context.Actions
                .AsNoTracking()
                .ToListAsync(cancellationToken);
        }
        public async Task<Action> DeleteAsync(Action action, CancellationToken cancellationToken)
        {
            context.Actions.Remove(action);
            await context.SaveChangesAsync(cancellationToken);
            return action;
        }
    }
}
