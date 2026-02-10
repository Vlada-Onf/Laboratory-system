using Domain.History.EntityTypes;
using LanguageExt;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Common.Interfaces.Repositories
{
    public interface IEntityTypeRepository
    {
        Task<EntityType> AddAsync(EntityType entityType, CancellationToken cancellationToken);
        Task<EntityType> UpdateAsync(EntityType entityType, CancellationToken cancellationToken);
        Task<Option<EntityType>> GetByIdAsync(EntityTypeId id, CancellationToken cancellationToken);
        Task<Option<EntityType>> GetByNameAsync(string name, CancellationToken cancellationToken);
    }
}
