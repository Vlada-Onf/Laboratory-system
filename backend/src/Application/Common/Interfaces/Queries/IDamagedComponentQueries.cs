using Domain.Components;
using Domain.DamagedComponents;
using LanguageExt;

namespace Application.Common.Interfaces.Queries
{
    public interface IDamagedComponentQueries
    {
        Task<Option<DamagedComponent>> GetByIdAsync(DamagedComponentId id, CancellationToken cancellationToken);
        Task<IReadOnlyList<DamagedComponent>> GetAllAsync(CancellationToken cancellationToken);
        Task<IReadOnlyList<DamagedComponent>> GetByComponentIdAsync(ComponentId componentId, CancellationToken cancellationToken);
    }
}
