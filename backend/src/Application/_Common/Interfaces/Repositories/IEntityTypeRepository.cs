using Domain.History.EntityTypes;
using LanguageExt;

namespace Application.Common.Interfaces.Repositories
{
    public interface IEntityTypeRepository
    {
        Task<EntityType> AddAsync(EntityType entityType, CancellationToken cancellationToken);
        Task<EntityType> UpdateAsync(EntityType entityType, CancellationToken cancellationToken);
        Task<EntityType> DeleteAsync(EntityType entityType, CancellationToken cancellationToken);

        Task<Option<EntityType>> GetByIdAsync(EntityTypeId id, CancellationToken cancellationToken);
        Task<Option<EntityType>> GetByNameAsync(string name, CancellationToken cancellationToken);
        Task<IReadOnlyList<EntityType>> GetAllAsync(CancellationToken cancellationToken);
    }
}
