using Application.Common.Interfaces.Repositories;
using Application.Wishlists.Exceptions;
using Domain.Components;
using Domain.Users;
using Domain.Wishlists;
using Domain.Wishlists.Importance;
using Domain.Wishlists.Status;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Wishlists.Commands.Create
{
    public sealed class CreateWishlistCommandHandler(
            IWishlistRepository wishlistRepository,
            IComponentRepository componentRepository)
            : IRequestHandler<CreateWishlistCommand, Either<WishlistException, Wishlist>>
    {
        public async Task<Either<WishlistException, Wishlist>> Handle(
            CreateWishlistCommand request,
            CancellationToken cancellationToken)
        {
            WishlistId? id = null;

            try
            {
                var componentId = new ComponentId(request.ComponentId);

                var componentOption = await componentRepository.GetByIdAsync(componentId, cancellationToken);
                if (componentOption.IsNone)
                    return new UnhandledWishlistException(WishlistId.Empty());

                var requestedBy = new UserId(request.RequestedBy);
                var importanceId = new WishlistImportanceId(request.ImportanceId);
                var statusId = new WishlistStatusId(request.StatusId);

                var wishlist = Wishlist.Create(
                    componentId: componentId,
                    name: request.Name,
                    description: request.Description,
                    quantityNeeded: request.QuantityNeeded,
                    requestedBy: requestedBy,
                    importanceId: importanceId,
                    statusId: statusId);

                id = wishlist.Id;

                var created = await wishlistRepository.AddAsync(wishlist, cancellationToken);

                return created;
            }
            catch (Exception ex)
            {
                return new UnhandledWishlistException(
                    id ?? WishlistId.Empty(),
                    ex);
            }
        }
    }
}
