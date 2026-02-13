using Application.Common.Interfaces.Queries;
using Domain.Components;
using Domain.Wishlists;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Wishlists.Queries
{
    public sealed record GetWishlistsByComponentIdQuery(Guid ComponentId)
            : IRequest<IReadOnlyList<Wishlist>>;
    public sealed class GetWishlistsByComponentIdQueryHandler(
        IWishlistQueries queries)
        : IRequestHandler<GetWishlistsByComponentIdQuery, IReadOnlyList<Wishlist>>
    {
        public async Task<IReadOnlyList<Wishlist>> Handle(
            GetWishlistsByComponentIdQuery request,
            CancellationToken cancellationToken)
        {
            var componentId = new ComponentId(request.ComponentId);
            return await queries.GetByComponentIdAsync(componentId, cancellationToken);
        }
    }
}
