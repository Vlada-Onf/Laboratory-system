using Application.Common.Interfaces.Queries;
using Application.Common.Interfaces.Repositories;
using Domain.Roles;
using LanguageExt;
using Microsoft.EntityFrameworkCore;


namespace Infrastructure.Persistence.Repositories
{
    public class RoleRepository(ApplicationDbContext context)
        : IRoleRepository, IRoleQueries
    {
        public async Task<Role> AddAsync(Role role, CancellationToken cancellationToken)
        {
            await context.Roles.AddAsync(role, cancellationToken);
            await context.SaveChangesAsync(cancellationToken);
            return role;
        }

        public async Task<Role> UpdateAsync(Role role, CancellationToken cancellationToken)
        {
            context.Roles.Update(role);
            await context.SaveChangesAsync(cancellationToken);
            return role;
        }

        public async Task<Option<Role>> GetByIdAsync(RoleId id, CancellationToken cancellationToken)
        {
            var entity = await context.Roles
                .AsNoTracking()
                .FirstOrDefaultAsync(r => r.Id == id, cancellationToken);

            return entity ?? Option<Role>.None;
        }

        public async Task<Option<Role>> GetByNameAsync(string name, CancellationToken cancellationToken)
        {
            var entity = await context.Roles
                .AsNoTracking()
                .FirstOrDefaultAsync(r => r.Name == name, cancellationToken);

            return entity ?? Option<Role>.None;
        }
        public async Task<Role> DeleteAsync(Role role, CancellationToken cancellationToken)
        {
            context.Roles.Remove(role);
            await context.SaveChangesAsync(cancellationToken);
            return role;
        }
        public async Task<IReadOnlyList<Role>> GetAllAsync(CancellationToken cancellationToken)
        {
            return await context.Roles
                .AsNoTracking()
                .OrderBy(r => r.Name)
                .ToListAsync(cancellationToken);
        }
    }
}
