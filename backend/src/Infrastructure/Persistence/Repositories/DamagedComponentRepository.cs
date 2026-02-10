using Application.Common.Interfaces.Queries;
using Application.Common.Interfaces.Repositories;
using Domain.Components;
using Domain.DamagedComponents;
using LanguageExt;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Persistence.Repositories
{
    public class DamagedComponentRepository(ApplicationDbContext context)
        : IDamagedComponentRepository, IDamagedComponentQueries
    {
        public async Task<DamagedComponent> AddAsync(DamagedComponent damagedComponent, CancellationToken cancellationToken)
        {
            await context.DamagedComponents.AddAsync(damagedComponent, cancellationToken);
            await context.SaveChangesAsync(cancellationToken);
            return damagedComponent;
        }

        public async Task<DamagedComponent> UpdateAsync(DamagedComponent damagedComponent, CancellationToken cancellationToken)
        {
            context.DamagedComponents.Update(damagedComponent);
            await context.SaveChangesAsync(cancellationToken);
            return damagedComponent;
        }

        public async Task<DamagedComponent> DeleteAsync(DamagedComponent damagedComponent, CancellationToken cancellationToken)
        {
            context.DamagedComponents.Remove(damagedComponent);
            await context.SaveChangesAsync(cancellationToken);
            return damagedComponent;
        }

        public async Task<Option<DamagedComponent>> GetByIdAsync(DamagedComponentId id, CancellationToken cancellationToken)
        {
            var damagedComponent = await context.DamagedComponents
                .AsNoTracking()
                .FirstOrDefaultAsync(dc => dc.Id == id, cancellationToken);

            return damagedComponent ?? Option<DamagedComponent>.None;
        }

        public async Task<IReadOnlyList<DamagedComponent>> GetAllAsync(CancellationToken cancellationToken)
        {
            return await context.DamagedComponents
                .AsNoTracking()
                .ToListAsync(cancellationToken);
        }

        public async Task<IReadOnlyList<DamagedComponent>> GetByComponentIdAsync(ComponentId componentId, CancellationToken cancellationToken)
        {
            return await context.DamagedComponents
                .AsNoTracking()
                .Where(dc => dc.ComponentId == componentId)
                .ToListAsync(cancellationToken);
        }
    }
}
