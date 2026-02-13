using Application.Common.Interfaces.Repositories;
using Application.WishlistsStatus.Exceptions;
using Domain.Wishlists.Status;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.WishlistsStatus.Commands.Delete
{
    public sealed class DeleteWishlistStatusCommandHandler(
            IWishlistStatusRepository statusRepository)
            : IRequestHandler<DeleteWishlistStatusCommand, Either<WishlistStatusException, WishlistStatus>>
    {
        public async Task<Either<WishlistStatusException, WishlistStatus>> Handle(
            DeleteWishlistStatusCommand request,
            CancellationToken cancellationToken)
        {
            var id = new WishlistStatusId(request.Id);
            var option = await statusRepository.GetByIdAsync(id, cancellationToken);

            return await option.MatchAsync(
                Some: status => DeleteEntity(status, cancellationToken),
                None: () => Task.FromResult<Either<WishlistStatusException, WishlistStatus>>(
                    new WishlistStatusNotFoundException(id)));
        }

        private async Task<Either<WishlistStatusException, WishlistStatus>> DeleteEntity(
            WishlistStatus status,
            CancellationToken cancellationToken)
        {
            try
            {
                var deleted = await statusRepository.DeleteAsync(status, cancellationToken);
                return deleted;
            }
            catch (Exception ex)
            {
                return new UnhandledWishlistStatusException(status.Id, ex);
            }
        }
    }
}
