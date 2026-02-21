using Application.Common.Interfaces.Queries;
using Application.Common.Interfaces.Repositories;
using Domain.Users;
using LanguageExt;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories
{
    public class UserRepository(ApplicationDbContext context)
        : IUserRepository, IUserQueries
    {
        public async Task<User> AddAsync(User user, CancellationToken cancellationToken)
        {
            await context.Users.AddAsync(user, cancellationToken);
            await context.SaveChangesAsync(cancellationToken);
            return user;
        }

        public async Task<User> UpdateAsync(User user, CancellationToken cancellationToken)
        {
            context.Users.Update(user);
            await context.SaveChangesAsync(cancellationToken);
            return user;
        }

        public async Task<User> DeleteAsync(User user, CancellationToken cancellationToken)
        {
            context.Users.Remove(user);
            await context.SaveChangesAsync(cancellationToken);
            return user;
        }

        public async Task<Option<User>> GetByIdAsync(UserId id, CancellationToken cancellationToken)
        {
            var entity = await context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Id == id, cancellationToken);

            return entity ?? Option<User>.None;
        }

        public async Task<Option<User>> GetByEmailAsync(string email, CancellationToken cancellationToken)
        {
            var entity = await context.Users
                .Include(u => u.Role)
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Email == email, cancellationToken);

            return entity ?? Option<User>.None;
        }

        public async Task<Option<User>> GetByClerkIdAsync(string clerkId, CancellationToken cancellationToken)
        {
            var entity = await context.Users
                .Include(u => u.Role)
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.ClerkId == clerkId, cancellationToken);

            return entity ?? Option<User>.None;
        }

        public async Task<IReadOnlyList<User>> GetAllAsync(CancellationToken cancellationToken)
        {
            return await context.Users
                .Include(u => u.Role)
                .AsNoTracking()
                .OrderBy(u => u.LastName)
                .ThenBy(u => u.FirstName)
                .ToListAsync(cancellationToken);
        }
    }
}