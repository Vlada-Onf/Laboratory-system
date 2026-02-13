using Domain.Roles;
using LanguageExt;

namespace Application.Common.Interfaces.Repositories
{
    public interface IRoleRepository
    {
        Task<Role> AddAsync(Role role, CancellationToken cancellationToken);
        Task<Role> UpdateAsync(Role role, CancellationToken cancellationToken);
        Task<Role> DeleteAsync(Role role, CancellationToken cancellationToken);

        Task<Option<Role>> GetByIdAsync(RoleId id, CancellationToken cancellationToken);
        Task<Option<Role>> GetByNameAsync(string name, CancellationToken cancellationToken);
        Task<IReadOnlyList<Role>> GetAllAsync(CancellationToken cancellationToken);
    }
}
