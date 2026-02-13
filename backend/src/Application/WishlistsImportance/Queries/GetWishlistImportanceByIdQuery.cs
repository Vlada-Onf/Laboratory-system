using Application.Common.Interfaces.Repositories;
using Domain.Wishlists.Importance;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.WishlistsImportance.Queries
{
    public sealed record GetWishlistImportanceByIdQuery(Guid Id)
            : IRequest<Option<WishlistImportance>>;
    public sealed class GetWishlistImportanceByIdQueryHandler(
        IWishlistImportanceRepository repository)
        : IRequestHandler<GetWishlistImportanceByIdQuery, Option<WishlistImportance>>
    {
        public async Task<Option<WishlistImportance>> Handle(
            GetWishlistImportanceByIdQuery request,
            CancellationToken cancellationToken)
        {
            var id = new WishlistImportanceId(request.Id);
            return await repository.GetByIdAsync(id, cancellationToken);
        }
    }
}
