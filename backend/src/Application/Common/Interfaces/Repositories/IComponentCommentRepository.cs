using Domain.Components.Comment;
using LanguageExt;

namespace Application.Common.Interfaces.Repositories
{
    public interface IComponentCommentRepository
    {
        Task<ComponentComment> AddAsync(ComponentComment comment, CancellationToken cancellationToken);
        Task<ComponentComment> UpdateAsync(ComponentComment comment, CancellationToken cancellationToken);
        Task<ComponentComment> DeleteAsync(ComponentComment comment, CancellationToken cancellationToken);

        Task<Option<ComponentComment>> GetByIdAsync(ComponentCommentId id, CancellationToken cancellationToken);
    }
}
