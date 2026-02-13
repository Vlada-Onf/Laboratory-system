using Application.Common.Interfaces.Repositories;
using Application.Wishlists.Exceptions;
using Domain.Wishlists;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Wishlists.Commands.Delete
{
    public sealed class DeleteWishlistCommandHandler(
            IWishlistRepository wishlistRepository)
            : IRequestHandler<DeleteWishlistCommand, Either<WishlistException, Wishlist>>
    {
        public async Task<Either<WishlistException, Wishlist>> Handle(
            DeleteWishlistCommand request,
            CancellationToken cancellationToken)
        {
            var id = new WishlistId(request.Id);
            var option = await wishlistRepository.GetByIdAsync(id, cancellationToken);

            return await option.MatchAsync(
                Some: w => DeleteEntity(w, cancellationToken),
                None: () => Task.FromResult<Either<WishlistException, Wishlist>>(
                    new WishlistNotFoundException(id)));
        }

        private async Task<Either<WishlistException, Wishlist>> DeleteEntity(
            Wishlist wishlist,
            CancellationToken cancellationToken)
        {
            try
            {
                var deleted = await wishlistRepository.DeleteAsync(wishlist, cancellationToken);
                return deleted;
            }
            catch (Exception ex)
            {
                return new UnhandledWishlistException(wishlist.Id, ex);
            }
        }
    }
}
