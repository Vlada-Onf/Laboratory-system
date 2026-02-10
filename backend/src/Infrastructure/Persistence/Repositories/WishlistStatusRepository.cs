using Application.Common.Interfaces.Repositories;
using Domain.Wishlists.Status;
using LanguageExt;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Persistence.Repositories
{
    public class WishlistStatusRepository(ApplicationDbContext context)
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
    }
}
