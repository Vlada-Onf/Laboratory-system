using Domain.DamagedComponents;
using LanguageExt;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Common.Interfaces.Repositories
{
    public interface IDamagedComponentRepository
    {
        Task<DamagedComponent> AddAsync(DamagedComponent damagedComponent, CancellationToken cancellationToken);
        Task<DamagedComponent> UpdateAsync(DamagedComponent damagedComponent, CancellationToken cancellationToken);
        Task<DamagedComponent> DeleteAsync(DamagedComponent damagedComponent, CancellationToken cancellationToken);
        Task<Option<DamagedComponent>> GetByIdAsync(DamagedComponentId id, CancellationToken cancellationToken);
    }
}
