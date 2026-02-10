using Domain.Tags;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Common.Interfaces.Repositories
{
    public interface ITagRepository
    {
        Task<IReadOnlyList<Tag>> GetByIdsAsync(List<Guid> tagIds, CancellationToken cancellationToken);
    }
}
