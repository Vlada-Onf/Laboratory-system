using Domain.Needs.Importance;
using LanguageExt;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Common.Interfaces.Repositories
{
    public interface INeedImportanceRepository
    {
        Task<NeedImportance> AddAsync(NeedImportance importance, CancellationToken cancellationToken);
        Task<NeedImportance> UpdateAsync(NeedImportance importance, CancellationToken cancellationToken);
        Task<Option<NeedImportance>> GetByIdAsync(NeedImportanceId id, CancellationToken cancellationToken);
        Task<Option<NeedImportance>> GetByLevelAsync(int level, CancellationToken cancellationToken);
    }
}
