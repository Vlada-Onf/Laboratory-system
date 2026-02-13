using Domain.Components.UsefulLink;
using LanguageExt;

namespace Application.Common.Interfaces.Repositories
{
    public interface IComponentUsefulLinkRepository
    {
        Task<ComponentUsefulLink> AddAsync(ComponentUsefulLink link, CancellationToken cancellationToken);
        Task<ComponentUsefulLink> UpdateAsync(ComponentUsefulLink link, CancellationToken cancellationToken);
        Task<ComponentUsefulLink> DeleteAsync(ComponentUsefulLink link, CancellationToken cancellationToken);

        Task<Option<ComponentUsefulLink>> GetByIdAsync(ComponentUsefulLinkId id, CancellationToken cancellationToken);
    }
}
