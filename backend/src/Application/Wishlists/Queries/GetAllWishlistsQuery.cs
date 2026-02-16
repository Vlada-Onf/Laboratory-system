using Application.Common.Interfaces.Queries;
using Domain.Wishlists;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Wishlists.Queries
{
    public sealed record GetAllWishlistsQuery()
            : IRequest<IReadOnlyList<Wishlist>>;
    public sealed class GetAllWishlistsQueryHandler(
        IWishlistQueries queries)
        : IRequestHandler<GetAllWishlistsQuery, IReadOnlyList<Wishlist>>
    {
        public async Task<IReadOnlyList<Wishlist>> Handle(
            GetAllWishlistsQuery request,
            CancellationToken cancellationToken)
        {
            return await queries.GetAllAsync(cancellationToken);
        }
    }
}
