using Domain.Users;
using LanguageExt;

namespace Application.Common.Interfaces.Queries
{
    public interface IUserQueries
    {
        Task<Option<User>> GetByIdAsync(UserId id, CancellationToken cancellationToken);
        Task<Option<User>> GetByEmailAsync(string email, CancellationToken cancellationToken);
        Task<Option<User>> GetByClerkIdAsync(string clerkId, CancellationToken cancellationToken);
        Task<IReadOnlyList<User>> GetAllAsync(CancellationToken cancellationToken);
    }
}