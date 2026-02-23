using Application.Common.Interfaces.Repositories;
using Application.WishlistsImportance.Exceptions;
using Domain.Wishlists.Importance;
using LanguageExt;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.WishlistsImportance.Commands.Delete
{
    public sealed class DeleteWishlistImportanceCommandHandler(
        IWishlistImportanceRepository importanceRepository,
        ILogger<DeleteWishlistImportanceCommandHandler> logger)
        : IRequestHandler<DeleteWishlistImportanceCommand, Either<WishlistImportanceException, WishlistImportance>>
    {
        public async Task<Either<WishlistImportanceException, WishlistImportance>> Handle(
            DeleteWishlistImportanceCommand request,
            CancellationToken cancellationToken)
        {
            var id = new WishlistImportanceId(request.Id);
            var option = await importanceRepository.GetByIdAsync(id, cancellationToken);

            return await option.MatchAsync(
                Some: importance => DeleteEntity(importance, cancellationToken),
                None: () =>
                {
                    logger.LogWarning("WishlistImportance not found for Id={Id}", id.Value);
                    return Task.FromResult<Either<WishlistImportanceException, WishlistImportance>>(
                        new WishlistImportanceNotFoundException(id));
                });
        }

        private async Task<Either<WishlistImportanceException, WishlistImportance>> DeleteEntity(
            WishlistImportance importance,
            CancellationToken cancellationToken)
        {
            try
            {
                var deleted = await importanceRepository.DeleteAsync(importance, cancellationToken);
                return deleted;
            }
            catch (Exception ex)
            {
                return new UnhandledWishlistImportanceException(importance.Id, ex);
            }
        }
    }
}
