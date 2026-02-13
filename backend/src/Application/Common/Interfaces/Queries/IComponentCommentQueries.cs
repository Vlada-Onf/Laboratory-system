using Domain.Components;
using Domain.Components.Comment;
using LanguageExt;

namespace Application.Common.Interfaces.Queries
{
    public interface IComponentCommentQueries
    {
        Task<Option<ComponentComment>> GetByIdAsync(ComponentCommentId id, CancellationToken cancellationToken);
        Task<IReadOnlyList<ComponentComment>> GetByComponentIdAsync(ComponentId componentId, CancellationToken cancellationToken);
    }
}
