using Application.Common.Interfaces.Repositories;
using Domain.Wishlists.Status;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.WishlistsStatus.Queries
{
    public sealed record GetWishlistStatusByIdQuery(Guid Id)
            : IRequest<Option<WishlistStatus>>;
    public sealed class GetWishlistStatusByIdQueryHandler(
        IWishlistStatusRepository repository)
        : IRequestHandler<GetWishlistStatusByIdQuery, Option<WishlistStatus>>
    {
        public async Task<Option<WishlistStatus>> Handle(
            GetWishlistStatusByIdQuery request,
            CancellationToken cancellationToken)
        {
            var id = new WishlistStatusId(request.Id);
            return await repository.GetByIdAsync(id, cancellationToken);
        }
    }
}
