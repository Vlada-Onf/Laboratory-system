using Domain.History;

namespace Application.Common.Interfaces.Repositories
{
    public interface IHistoryRepository
    {
        Task<History> AddAsync(History entry, CancellationToken cancellationToken);
    }
}
