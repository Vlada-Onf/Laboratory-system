using Domain.Components;
using Domain.Tags;
using LanguageExt;

namespace Application.Common.Interfaces.Repositories
{
    public interface ITagRepository
    {
        Task<Tag> AddAsync(Tag tag, CancellationToken cancellationToken);
        Task<Tag> UpdateAsync(Tag tag, CancellationToken cancellationToken);
        Task<Tag> DeleteAsync(Tag tag, CancellationToken cancellationToken);

        Task<Option<Tag>> GetByIdAsync(TagId id, CancellationToken cancellationToken);
        Task<IReadOnlyList<Tag>> GetByIdsAsync(List<Guid> tagIds, CancellationToken cancellationToken);
        Task<IReadOnlyList<Tag>> GetAllAsync(CancellationToken cancellationToken);

        Task<IReadOnlyList<Tag>> GetByComponentAsync(
            ComponentId componentId,
            CancellationToken cancellationToken);
    }
}
