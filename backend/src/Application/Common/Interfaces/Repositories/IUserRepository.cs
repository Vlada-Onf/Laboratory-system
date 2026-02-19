using Domain.Users;
using LanguageExt;

namespace Application.Common.Interfaces.Repositories
{
    public interface IUserRepository
    {
        Task<User> AddAsync(User user, CancellationToken cancellationToken);
        Task<User> UpdateAsync(User user, CancellationToken cancellationToken);
        Task<User> DeleteAsync(User user, CancellationToken cancellationToken);

        Task<Option<User>> GetByIdAsync(UserId id, CancellationToken cancellationToken);
        Task<Option<User>> GetByEmailAsync(string email, CancellationToken cancellationToken);
        Task<Option<User>> GetByClerkIdAsync(string clerkId, CancellationToken cancellationToken);
        Task<IReadOnlyList<User>> GetAllAsync(CancellationToken cancellationToken);
    }
}
