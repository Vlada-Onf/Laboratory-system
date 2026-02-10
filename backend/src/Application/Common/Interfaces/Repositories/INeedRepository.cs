using Domain.Needs;
using LanguageExt;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Common.Interfaces.Repositories
{
    public interface INeedRepository
    {
        Task<Need> AddAsync(Need need, CancellationToken cancellationToken);
        Task<Need> UpdateAsync(Need need, CancellationToken cancellationToken);
        Task<Need> DeleteAsync(Need need, CancellationToken cancellationToken);
        Task<Option<Need>> GetByIdAsync(NeedId id, CancellationToken cancellationToken);
    }
}
