using Domain.Categories;
using Domain.Components;
using LanguageExt;

namespace Application.Common.Interfaces.Repositories
{
    public interface IComponentRepository
    {
        Task<Component> AddAsync(Component component, CancellationToken cancellationToken);
        Task<Component> UpdateAsync(Component component, CancellationToken cancellationToken);
        Task<Component> DeleteAsync(Component component, CancellationToken cancellationToken);

        Task<Option<Component>> GetByIdAsync(ComponentId id, CancellationToken cancellationToken);
        Task<Option<Component>> GetByNameAsync(string name, CancellationToken cancellationToken);
        Task<IReadOnlyList<Component>> GetAllAsync(CancellationToken cancellationToken);
        Task<IReadOnlyList<Component>> GetByCategoryIdAsync(CategoryId categoryId, CancellationToken cancellationToken);

        Task ClearComponentTagsAsync(ComponentId componentId, CancellationToken cancellationToken = default);
    }
}
