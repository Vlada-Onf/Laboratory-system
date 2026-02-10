using Domain.Categories;
using LanguageExt;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Common.Interfaces.Repositories
{
    public interface ICategoryRepository
    {
        Task<Option<Category>> GetByNameAsync(string name, CancellationToken cancellationToken);
        Task<bool> ExistsAsync(CategoryId id, CancellationToken cancellationToken);
        Task<Option<Category>> GetByIdAsync(CategoryId id, CancellationToken cancellationToken);
        Task<IReadOnlyList<Category>> GetAllAsync(CancellationToken cancellationToken = default);
        Task AddAsync(Category category, CancellationToken cancellationToken = default);
        Task RemoveAsync(Category category, CancellationToken cancellationToken = default);
        Task<bool> ExistsByNameAsync(string name, CancellationToken cancellationToken = default);
    }
}
