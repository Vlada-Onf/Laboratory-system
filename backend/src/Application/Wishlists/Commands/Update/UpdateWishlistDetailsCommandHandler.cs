using Application.Common.Interfaces.Repositories;
using Application.Wishlists.Exceptions;
using Domain.Wishlists;
using Domain.Wishlists.Importance;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Wishlists.Commands.Update
{
    public sealed class UpdateWishlistDetailsCommandHandler(
            IWishlistRepository wishlistRepository)
            : IRequestHandler<UpdateWishlistDetailsCommand, Either<WishlistException, Wishlist>>
    {
        public async Task<Either<WishlistException, Wishlist>> Handle(
            UpdateWishlistDetailsCommand request,
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
            UpdateWishlistDetailsCommand request,
            CancellationToken cancellationToken)
        {
            try
            {
                var importanceId = new WishlistImportanceId(request.ImportanceId);

                wishlist.UpdateDetails(
                    name: request.Name,
                    description: request.Description,
                    quantityNeeded: request.QuantityNeeded,
                    importanceId: importanceId);

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
