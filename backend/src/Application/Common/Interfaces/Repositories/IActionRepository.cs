using Domain.History.Actions;
using LanguageExt;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Common.Interfaces.Repositories
{
    public interface IActionRepository
    {
        Task<Action> AddAsync(Action action, CancellationToken cancellationToken);
        Task<Action> UpdateAsync(Action action, CancellationToken cancellationToken);
        Task<Option<Action>> GetByIdAsync(ActionId id, CancellationToken cancellationToken);
        Task<Option<Action>> GetByNameAsync(string name, CancellationToken cancellationToken);
    }
}
