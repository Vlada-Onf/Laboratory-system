using Application.Common.Interfaces.Queries;
using Domain.Wishlists;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Wishlists.Queries
{
    public sealed record GetWishlistByIdQuery(Guid Id)
            : IRequest<Option<Wishlist>>;
    public sealed class GetWishlistByIdQueryHandler(
        IWishlistQueries queries)
        : IRequestHandler<GetWishlistByIdQuery, Option<Wishlist>>
    {
        public async Task<Option<Wishlist>> Handle(
            GetWishlistByIdQuery request,
            CancellationToken cancellationToken)
        {
            var id = new WishlistId(request.Id);
            return await queries.GetByIdAsync(id, cancellationToken);
        }
    }
}
