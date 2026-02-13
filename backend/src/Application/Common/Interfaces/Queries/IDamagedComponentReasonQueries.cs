using Domain.DamagedComponents.Reason;
using LanguageExt;

namespace Application.Common.Interfaces.Queries
{
    public interface IDamagedComponentReasonQueries
    {
        Task<Option<DamagedComponentReason>> GetByIdAsync(DamagedComponentReasonId id, CancellationToken cancellationToken);
        Task<IReadOnlyList<DamagedComponentReason>> GetAllAsync(CancellationToken cancellationToken);
    }
}
