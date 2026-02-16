using Domain.Components;
using Domain.Tags;
using LanguageExt;

namespace Application.Common.Interfaces.Queries
{
    public interface ITagQueries
    {
        Task<Option<Tag>> GetByIdAsync(TagId id, CancellationToken cancellationToken);
        Task<IReadOnlyList<Tag>> GetAllAsync(CancellationToken cancellationToken);
        Task<IReadOnlyList<Tag>> GetByComponentIdAsync(
            ComponentId componentId,
            CancellationToken cancellationToken);
    }
}
