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

namespace Application.WishlistsStatus.Commands.Update
{
    public sealed class UpdateWishlistStatusCommandHandler(
            IWishlistStatusRepository statusRepository)
            : IRequestHandler<UpdateWishlistStatusCommand, Either<WishlistStatusException, WishlistStatus>>
    {
        public async Task<Either<WishlistStatusException, WishlistStatus>> Handle(
            UpdateWishlistStatusCommand request,
            CancellationToken cancellationToken)
        {
            var id = new WishlistStatusId(request.Id);
            var option = await statusRepository.GetByIdAsync(id, cancellationToken);

            return await option.MatchAsync(
                Some: status => UpdateEntity(status, request, cancellationToken),
                None: () => Task.FromResult<Either<WishlistStatusException, WishlistStatus>>(
                    new WishlistStatusNotFoundException(id)));
        }

        private async Task<Either<WishlistStatusException, WishlistStatus>> UpdateEntity(
            WishlistStatus status,
            UpdateWishlistStatusCommand request,
            CancellationToken cancellationToken)
        {
            try
            {
                status.Update(
                    name: request.Name,
                    description: request.Description);

                var updated = await statusRepository.UpdateAsync(status, cancellationToken);

                return updated;
            }
            catch (Exception ex)
            {
                return new UnhandledWishlistStatusException(status.Id, ex);
            }
        }
    }
}
