using Application.Common.Interfaces.Repositories;
using Domain.Wishlists.Status;
using LanguageExt;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;


namespace Infrastructure.Persistence.Repositories
{
    public class WishlistStatusRepository(ApplicationDbContext context, ILogger<WishlistStatusRepository> logger)
        : IWishlistStatusRepository
    {
        public async Task<WishlistStatus> AddAsync(WishlistStatus status, CancellationToken cancellationToken)
        {
            await context.WishlistStatuses.AddAsync(status, cancellationToken);
            await context.SaveChangesAsync(cancellationToken);
            return status;
        }

        public async Task<WishlistStatus> UpdateAsync(WishlistStatus status, CancellationToken cancellationToken)
        {
            context.WishlistStatuses.Update(status);
            await context.SaveChangesAsync(cancellationToken);
            return status;
        }

        public async Task<Option<WishlistStatus>> GetByIdAsync(WishlistStatusId id, CancellationToken cancellationToken)
        {
            var entity = await context.WishlistStatuses
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.Id == id, cancellationToken);

            return entity ?? Option<WishlistStatus>.None;
        }
        public async Task<IReadOnlyList<WishlistStatus>> GetAllAsync(CancellationToken cancellationToken)
        {
            return await context.WishlistStatuses
                .AsNoTracking()
                .ToListAsync(cancellationToken);
        }
        public async Task<WishlistStatus> DeleteAsync(WishlistStatus status, CancellationToken cancellationToken)
        {
            logger.LogInformation("Repository: removing WishlistStatus Id={Id}, Name={Name}",
                status.Id.Value, status.Name);

            try
            {
                context.WishlistStatuses.Remove(status);
                await context.SaveChangesAsync(cancellationToken);

                logger.LogInformation("Repository: WishlistStatus removed Id={Id}", status.Id.Value);

                return status;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Repository: error while removing WishlistStatus Id={Id}", status.Id.Value);
                throw;
            }
        }
    }
}