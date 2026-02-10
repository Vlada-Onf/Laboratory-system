using Domain.History;
using Domain.History.EntityTypes;
using Domain.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Common.Interfaces.Queries
{
    public interface IHistoryQueries
    {
        Task<IReadOnlyList<History>> GetByUserAsync(UserId userId, CancellationToken cancellationToken);
        Task<IReadOnlyList<History>> GetByEntityAsync(string entityId, CancellationToken cancellationToken);
        Task<IReadOnlyList<History>> GetByEntityAndTypeAsync(EntityTypeId entityTypeId, string entityId, CancellationToken cancellationToken);
    }
}
