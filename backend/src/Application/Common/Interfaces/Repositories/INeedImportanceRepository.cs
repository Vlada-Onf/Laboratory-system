using Domain.Needs.Importance;
using LanguageExt;

namespace Application.Common.Interfaces.Repositories
{
    public interface INeedImportanceRepository
    {
        Task<NeedImportance> AddAsync(NeedImportance importance, CancellationToken cancellationToken);
        Task<NeedImportance> UpdateAsync(NeedImportance importance, CancellationToken cancellationToken);
        Task<NeedImportance> DeleteAsync(NeedImportance importance, CancellationToken cancellationToken);

        Task<Option<NeedImportance>> GetByIdAsync(NeedImportanceId id, CancellationToken cancellationToken);
        Task<Option<NeedImportance>> GetByLevelAsync(int level, CancellationToken cancellationToken);
        Task<IReadOnlyList<NeedImportance>> GetAllAsync(CancellationToken cancellationToken);
    }
}
