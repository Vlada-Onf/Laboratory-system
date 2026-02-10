using Domain.Components;
using LanguageExt;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Common.Interfaces.Queries
{
    public interface IComponentQueries
    {
        Task<Option<Component>> GetByIdAsync(ComponentId id, CancellationToken cancellationToken);
        Task<IReadOnlyList<Component>> GetAllAsync(CancellationToken cancellationToken);
    }
}
