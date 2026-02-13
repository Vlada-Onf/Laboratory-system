using Domain.Components;
using Domain.Needs;
using Domain.Needs.Importance;
using Domain.Users;
using LanguageExt;

namespace Application.Common.Interfaces.Queries
{
    public interface INeedQueries
    {
        Task<Option<Need>> GetByIdAsync(NeedId id, CancellationToken cancellationToken);
        Task<IReadOnlyList<Need>> GetByComponentIdAsync(ComponentId componentId, CancellationToken cancellationToken);
        Task<IReadOnlyList<Need>> GetByUserAsync(UserId userId, CancellationToken cancellationToken);
        Task<IReadOnlyList<Need>> GetByImportanceAsync(NeedImportanceId importanceId, CancellationToken cancellationToken);
    }
}
