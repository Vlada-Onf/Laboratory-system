using Application.Common.Interfaces.Queries;
using Application.Common.Interfaces.Repositories;
using Domain.DamagedComponents.Reason;
using LanguageExt;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Persistence.Repositories
{
    public class DamagedComponentReasonRepository(ApplicationDbContext context)
        : IDamagedComponentReasonRepository, IDamagedComponentReasonQueries
    {
        public async Task<DamagedComponentReason> AddAsync(DamagedComponentReason reason, CancellationToken cancellationToken)
        {
            await context.DamagedComponentReasons.AddAsync(reason, cancellationToken);
            await context.SaveChangesAsync(cancellationToken);
            return reason;
        }

        public async Task<DamagedComponentReason> UpdateAsync(DamagedComponentReason reason, CancellationToken cancellationToken)
        {
            context.DamagedComponentReasons.Update(reason);
            await context.SaveChangesAsync(cancellationToken);
            return reason;
        }

        public async Task<Option<DamagedComponentReason>> GetByIdAsync(DamagedComponentReasonId id, CancellationToken cancellationToken)
        {
            var reason = await context.DamagedComponentReasons
                .AsNoTracking()
                .FirstOrDefaultAsync(r => r.Id == id, cancellationToken);

            return reason ?? Option<DamagedComponentReason>.None;
        }

        public async Task<IReadOnlyList<DamagedComponentReason>> GetAllAsync(CancellationToken cancellationToken)
        {
            return await context.DamagedComponentReasons
                .AsNoTracking()
                .ToListAsync(cancellationToken);
        }

        public async Task<bool> ExistsAsync(DamagedComponentReasonId id, CancellationToken cancellationToken)
        {
            return await context.DamagedComponentReasons
                .AnyAsync(r => r.Id == id, cancellationToken);
        }
    }
}
