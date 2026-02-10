using Domain.Needs.Status;
using LanguageExt;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Common.Interfaces.Repositories
{
    public interface INeedStatusRepository
    {
        Task<NeedStatus> AddAsync(NeedStatus status, CancellationToken cancellationToken);
        Task<NeedStatus> UpdateAsync(NeedStatus status, CancellationToken cancellationToken);
        Task<Option<NeedStatus>> GetByIdAsync(NeedStatusId id, CancellationToken cancellationToken);
        Task<Option<NeedStatus>> GetByNameAsync(string name, CancellationToken cancellationToken);
    }
}
