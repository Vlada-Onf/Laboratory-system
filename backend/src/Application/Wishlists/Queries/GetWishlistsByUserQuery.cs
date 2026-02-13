using Application.Common.Interfaces.Queries;
using Domain.Users;
using Domain.Wishlists;
using MediatR;

namespace Application.Wishlists.Queries
{
    public sealed record GetWishlistsByUserQuery(Guid UserId)
            : IRequest<IReadOnlyList<Wishlist>>;
    public sealed class GetWishlistsByUserQueryHandler(
        IWishlistQueries queries)
        : IRequestHandler<GetWishlistsByUserQuery, IReadOnlyList<Wishlist>>
    {
        public async Task<IReadOnlyList<Wishlist>> Handle(
            GetWishlistsByUserQuery request,
            CancellationToken cancellationToken)
        {
            var userId = new UserId(request.UserId);
            return await queries.GetByUserAsync(userId, cancellationToken);
        }
    }
}
