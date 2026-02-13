using Domain.Components;
using Domain.DamagedComponents;
using LanguageExt;

namespace Application.Common.Interfaces.Repositories
{
    public interface IDamagedComponentRepository
    {
        Task<DamagedComponent> AddAsync(DamagedComponent damagedComponent, CancellationToken cancellationToken);
        Task<DamagedComponent> UpdateAsync(DamagedComponent damagedComponent, CancellationToken cancellationToken);
        Task<DamagedComponent> DeleteAsync(DamagedComponent damagedComponent, CancellationToken cancellationToken);

        Task<Option<DamagedComponent>> GetByIdAsync(DamagedComponentId id, CancellationToken cancellationToken);
        Task<IReadOnlyList<DamagedComponent>> GetAllAsync(CancellationToken cancellationToken);
        Task<IReadOnlyList<DamagedComponent>> GetByComponentIdAsync(ComponentId componentId, CancellationToken cancellationToken);
    }
}
