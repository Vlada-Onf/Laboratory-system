using Application.Common.Interfaces.Repositories;
using Domain.History.EntityTypes;
using LanguageExt;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Persistence.Repositories
{
    public class EntityTypeRepository(ApplicationDbContext context) : IEntityTypeRepository
    {
        public async Task<EntityType> AddAsync(EntityType entityType, CancellationToken cancellationToken)
        {
            await context.EntityTypes.AddAsync(entityType, cancellationToken);
            await context.SaveChangesAsync(cancellationToken);
            return entityType;
        }

        public async Task<EntityType> UpdateAsync(EntityType entityType, CancellationToken cancellationToken)
        {
            context.EntityTypes.Update(entityType);
            await context.SaveChangesAsync(cancellationToken);
            return entityType;
        }

        public async Task<Option<EntityType>> GetByIdAsync(EntityTypeId id, CancellationToken cancellationToken)
        {
            var entity = await context.EntityTypes
                .AsNoTracking()
                .FirstOrDefaultAsync(et => et.Id == id, cancellationToken);

            return entity ?? Option<EntityType>.None;
        }

        public async Task<Option<EntityType>> GetByNameAsync(string name, CancellationToken cancellationToken)
        {
            var entity = await context.EntityTypes
                .AsNoTracking()
                .FirstOrDefaultAsync(et => et.Name == name, cancellationToken);

            return entity ?? Option<EntityType>.None;
        }
    }
}
