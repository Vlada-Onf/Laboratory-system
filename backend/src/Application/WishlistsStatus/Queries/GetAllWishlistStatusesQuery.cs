using Application.Common.Interfaces.Repositories;
using Domain.Wishlists.Status;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.WishlistsStatus.Queries
{
    public sealed record GetAllWishlistStatusesQuery
        : IRequest<IReadOnlyList<WishlistStatus>>;
    public sealed class GetAllWishlistStatusesQueryHandler(
        IWishlistStatusRepository repository)
        : IRequestHandler<GetAllWishlistStatusesQuery, IReadOnlyList<WishlistStatus>>
    {
        public async Task<IReadOnlyList<WishlistStatus>> Handle(
            GetAllWishlistStatusesQuery request,
            CancellationToken cancellationToken)
        {
            return await repository.GetAllAsync(cancellationToken);
        }
    }
}
