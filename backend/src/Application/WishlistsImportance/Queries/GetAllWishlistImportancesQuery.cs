using Application.Common.Interfaces.Repositories;
using Domain.Wishlists.Importance;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.WishlistsImportance.Queries
{
    public sealed record GetAllWishlistImportancesQuery
            : IRequest<IReadOnlyList<WishlistImportance>>;
    public sealed class GetAllWishlistImportancesQueryHandler(
        IWishlistImportanceRepository repository)
        : IRequestHandler<GetAllWishlistImportancesQuery, IReadOnlyList<WishlistImportance>>
    {
        public async Task<IReadOnlyList<WishlistImportance>> Handle(
            GetAllWishlistImportancesQuery request,
            CancellationToken cancellationToken)
        {
            return await repository.GetAllAsync(cancellationToken);
        }
    }
}
