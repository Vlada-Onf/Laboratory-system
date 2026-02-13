using Application.Common.Interfaces.Repositories;
using Application.Wishlists.Exceptions;
using Domain.Wishlists;
using Domain.Wishlists.Status;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Wishlists.Commands.Update
{
    public sealed class UpdateWishlistStatusCommandHandler(
            IWishlistRepository wishlistRepository)
            : IRequestHandler<UpdateWishlistStatusCommand, Either<WishlistException, Wishlist>>
    {
        public async Task<Either<WishlistException, Wishlist>> Handle(
            UpdateWishlistStatusCommand request,
            CancellationToken cancellationToken)
        {
            var id = new WishlistId(request.Id);
            var option = await wishlistRepository.GetByIdAsync(id, cancellationToken);

            return await option.MatchAsync(
                Some: w => UpdateEntity(w, request, cancellationToken),
                None: () => Task.FromResult<Either<WishlistException, Wishlist>>(
                    new WishlistNotFoundException(id)));
        }

        private async Task<Either<WishlistException, Wishlist>> UpdateEntity(
            Wishlist wishlist,
            UpdateWishlistStatusCommand request,
            CancellationToken cancellationToken)
        {
            try
            {
                var statusId = new WishlistStatusId(request.StatusId);

                wishlist.UpdateStatus(
                    statusId: statusId,
                    reason: request.CompletionReason);

                var updated = await wishlistRepository.UpdateAsync(wishlist, cancellationToken);

                return updated;
            }
            catch (Exception ex)
            {
                return new UnhandledWishlistException(wishlist.Id, ex);
            }
        }
    }
}
