using Domain.Components;
using LanguageExt;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Common.Interfaces.Repositories
{
    public interface IComponentRepository
    {
        Task<Component> AddAsync(Component component, CancellationToken cancellationToken);
        Task<Component> UpdateAsync(Component component, CancellationToken cancellationToken);
        Task<Component> DeleteAsync(Component component, CancellationToken cancellationToken);
        Task<Option<Component>> GetByIdAsync(ComponentId id, CancellationToken cancellationToken);
        Task<Option<Component>> GetByNameAsync(string name, CancellationToken cancellationToken);
    }
}
