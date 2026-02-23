using Application.Common.Interfaces.Repositories;
using Application.WishlistsStatus.Exceptions;
using Domain.Wishlists.Status;
using LanguageExt;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.WishlistsStatus.Commands.Delete
{
    public sealed class DeleteWishlistStatusCommandHandler(
            IWishlistStatusRepository statusRepository,
            ILogger<DeleteWishlistStatusCommandHandler> logger)
        : IRequestHandler<DeleteWishlistStatusCommand, Either<WishlistStatusException, WishlistStatus>>
    {
        public async Task<Either<WishlistStatusException, WishlistStatus>> Handle(
            DeleteWishlistStatusCommand request,
            CancellationToken cancellationToken)
        {
            logger.LogInformation("DeleteWishlistStatus started for Id={Id}", request.Id);

            var id = new WishlistStatusId(request.Id);
            var option = await statusRepository.GetByIdAsync(id, cancellationToken);

            return await option.MatchAsync(
                Some: status => DeleteEntity(status, cancellationToken),
                None: () =>
                {
                    logger.LogWarning("WishlistStatus not found for Id={Id}", id.Value);
                    return Task.FromResult<Either<WishlistStatusException, WishlistStatus>>(
                        new WishlistStatusNotFoundException(id));
                });
        }

        private async Task<Either<WishlistStatusException, WishlistStatus>> DeleteEntity(
            WishlistStatus status,
            CancellationToken cancellationToken)
        {
            try
            {
                logger.LogInformation("Deleting WishlistStatus Id={Id}, Name={Name}",
                    status.Id.Value, status.Name);

                var deleted = await statusRepository.DeleteAsync(status, cancellationToken);

                logger.LogInformation("WishlistStatus deleted successfully Id={Id}",
                    deleted.Id.Value);

                return deleted;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error while deleting WishlistStatus Id={Id}", status.Id.Value);
                return new UnhandledWishlistStatusException(status.Id, ex);
            }
        }
    }
}
