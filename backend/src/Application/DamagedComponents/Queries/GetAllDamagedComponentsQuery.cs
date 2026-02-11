using Application.Common.Interfaces.Queries;
using MediatR;


namespace Application.DamagedComponents.Queries
{
    public record GetAllDamagedComponentsQuery
         : IRequest<IReadOnlyList<DamagedComponent>>;

    public class GetAllDamagedComponentsQueryHandler(
        IDamagedComponentQueries queries)
        : IRequestHandler<GetAllDamagedComponentsQuery, IReadOnlyList<DamagedComponent>>
    {
        public async Task<IReadOnlyList<DamagedComponent>> Handle(
            GetAllDamagedComponentsQuery request,
            CancellationToken cancellationToken)
        {
            return await queries.GetAllAsync(cancellationToken);
        }
    }
}
