using Application.Common.Interfaces.Repositories;
using Domain.Wishlists.Importance;
using LanguageExt;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Persistence.Repositories
{
    public class WishlistImportanceRepository(ApplicationDbContext context)
        : IWishlistImportanceRepository
    {
        public async Task<WishlistImportance> AddAsync(WishlistImportance importance, CancellationToken cancellationToken)
        {
            await context.WishlistImportances.AddAsync(importance, cancellationToken);
            await context.SaveChangesAsync(cancellationToken);
            return importance;
        }

        public async Task<WishlistImportance> UpdateAsync(WishlistImportance importance, CancellationToken cancellationToken)
        {
            context.WishlistImportances.Update(importance);
            await context.SaveChangesAsync(cancellationToken);
            return importance;
        }

        public async Task<Option<WishlistImportance>> GetByIdAsync(WishlistImportanceId id, CancellationToken cancellationToken)
        {
            var entity = await context.WishlistImportances
                .AsNoTracking()
                .FirstOrDefaultAsync(i => i.Id == id, cancellationToken);

            return entity ?? Option<WishlistImportance>.None;
        }
    }
}
