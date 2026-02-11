using Domain.Needs.Status;
using LanguageExt;

namespace Application.Common.Interfaces.Repositories
{
    public interface INeedStatusRepository
    {
        Task<NeedStatus> AddAsync(NeedStatus status, CancellationToken cancellationToken);
        Task<NeedStatus> UpdateAsync(NeedStatus status, CancellationToken cancellationToken);
        Task<NeedStatus> DeleteAsync(NeedStatus status, CancellationToken cancellationToken);

        Task<Option<NeedStatus>> GetByIdAsync(NeedStatusId id, CancellationToken cancellationToken);
        Task<Option<NeedStatus>> GetByNameAsync(string name, CancellationToken cancellationToken);
        Task<IReadOnlyList<NeedStatus>> GetAllAsync(CancellationToken cancellationToken);
    }
}
