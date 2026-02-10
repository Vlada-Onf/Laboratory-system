using Domain.Categories;
using LanguageExt;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Common.Interfaces.Queries
{
    public interface ICategoryQueries
    {
        Task<Option<Category>> GetByIdAsync(CategoryId id, CancellationToken cancellationToken);
        Task<IReadOnlyList<Category>> GetAllAsync(CancellationToken cancellationToken);
    }
}
