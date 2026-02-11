using Domain.Categories;
using LanguageExt;

namespace Application.Common.Interfaces.Queries
{
    public interface ICategoryQueries
    {
        Task<IReadOnlyList<Category>> GetAllAsync(CancellationToken cancellationToken);
        Task<Option<Category>> GetByIdAsync(CategoryId id, CancellationToken cancellationToken);
    }
}
