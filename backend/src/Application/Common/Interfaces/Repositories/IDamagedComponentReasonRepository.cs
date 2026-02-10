using Domain.DamagedComponents.Reason;
using LanguageExt;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Common.Interfaces.Repositories
{
    public interface IDamagedComponentReasonRepository
    {
        Task<DamagedComponentReason> AddAsync(DamagedComponentReason reason, CancellationToken cancellationToken);
        Task<DamagedComponentReason> UpdateAsync(DamagedComponentReason reason, CancellationToken cancellationToken);
        Task<Option<DamagedComponentReason>> GetByIdAsync(DamagedComponentReasonId id, CancellationToken cancellationToken);
        Task<bool> ExistsAsync(DamagedComponentReasonId id, CancellationToken cancellationToken);
    }
}
