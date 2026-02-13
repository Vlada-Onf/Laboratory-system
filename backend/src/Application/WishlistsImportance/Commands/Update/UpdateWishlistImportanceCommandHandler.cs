using Application.Common.Interfaces.Repositories;
using Application.WishlistsImportance.Exceptions;
using Domain.Wishlists.Importance;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.WishlistsImportance.Commands.Update
{
    public sealed class UpdateWishlistImportanceCommandHandler(
            IWishlistImportanceRepository importanceRepository)
            : IRequestHandler<UpdateWishlistImportanceCommand, Either<WishlistImportanceException, WishlistImportance>>
    {
        public async Task<Either<WishlistImportanceException, WishlistImportance>> Handle(
            UpdateWishlistImportanceCommand request,
            CancellationToken cancellationToken)
        {
            var id = new WishlistImportanceId(request.Id);
            var option = await importanceRepository.GetByIdAsync(id, cancellationToken);

            return await option.MatchAsync(
                Some: importance => UpdateEntity(importance, request, cancellationToken),
                None: () => Task.FromResult<Either<WishlistImportanceException, WishlistImportance>>(
                    new WishlistImportanceNotFoundException(id)));
        }

        private async Task<Either<WishlistImportanceException, WishlistImportance>> UpdateEntity(
            WishlistImportance importance,
            UpdateWishlistImportanceCommand request,
            CancellationToken cancellationToken)
        {
            try
            {
                importance.Update(
                    name: request.Name,
                    level: request.Level);

                var updated = await importanceRepository.UpdateAsync(importance, cancellationToken);

                return updated;
            }
            catch (Exception ex)
            {
                return new UnhandledWishlistImportanceException(importance.Id, ex);
            }
        }
    }
}
