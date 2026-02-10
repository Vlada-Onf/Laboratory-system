using Domain.DamagedComponents.Reason;
using LanguageExt;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Common.Interfaces.Queries
{
    public interface IDamagedComponentReasonQueries
    {
        Task<Option<DamagedComponentReason>> GetByIdAsync(DamagedComponentReasonId id, CancellationToken cancellationToken);
        Task<IReadOnlyList<DamagedComponentReason>> GetAllAsync(CancellationToken cancellationToken);
    }
}
