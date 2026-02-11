using Domain.History.Actions;
using LanguageExt;

namespace Application.Common.Interfaces.Repositories
{
    public interface IActionRepository
    {
        Task<Action> AddAsync(Action action, CancellationToken cancellationToken);
        Task<Action> UpdateAsync(Action action, CancellationToken cancellationToken);
        Task<Action> DeleteAsync(Action action, CancellationToken cancellationToken);

        Task<Option<Action>> GetByIdAsync(ActionId id, CancellationToken cancellationToken);
        Task<Option<Action>> GetByNameAsync(string name, CancellationToken cancellationToken);
        Task<IReadOnlyList<Action>> GetAllAsync(CancellationToken cancellationToken);
    }
}
