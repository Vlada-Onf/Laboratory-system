using Domain.Roles;
using LanguageExt;

namespace Application.Common.Interfaces.Queries
{
    public interface IRoleQueries
    {
        Task<Option<Role>> GetByIdAsync(RoleId id, CancellationToken cancellationToken);
        Task<Option<Role>> GetByNameAsync(string name, CancellationToken cancellationToken);
        Task<IReadOnlyList<Role>> GetAllAsync(CancellationToken cancellationToken);
    }
}
