using Domain.Categories;
using Domain.Components;
using LanguageExt;

namespace Application.Common.Interfaces.Queries
{
    public interface IComponentQueries
    {
        Task<Option<Component>> GetByIdAsync(ComponentId id, CancellationToken cancellationToken);
        Task<IReadOnlyList<Component>> GetAllAsync(CancellationToken cancellationToken);
        Task<IReadOnlyList<Component>> GetByCategoryIdAsync(CategoryId categoryId, CancellationToken cancellationToken);
    }
}
