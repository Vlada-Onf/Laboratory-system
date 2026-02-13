using Domain.Components;
using Domain.Components.UsefulLink;
using LanguageExt;

namespace Application.Common.Interfaces.Queries
{
    public interface IComponentUsefulLinkQueries
    {
        Task<Option<ComponentUsefulLink>> GetByIdAsync(ComponentUsefulLinkId id, CancellationToken cancellationToken);
        Task<IReadOnlyList<ComponentUsefulLink>> GetByComponentIdAsync(ComponentId componentId, CancellationToken cancellationToken);
    }
}
