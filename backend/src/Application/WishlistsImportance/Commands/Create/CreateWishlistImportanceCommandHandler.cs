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

namespace Application.WishlistsImportance.Commands.Create
{
    public sealed class CreateWishlistImportanceCommandHandler(
            IWishlistImportanceRepository importanceRepository)
            : IRequestHandler<CreateWishlistImportanceCommand, Either<WishlistImportanceException, WishlistImportance>>
    {
        public async Task<Either<WishlistImportanceException, WishlistImportance>> Handle(
            CreateWishlistImportanceCommand request,
            CancellationToken cancellationToken)
        {
            var all = await importanceRepository.GetAllAsync(cancellationToken);
            var existing = all.FirstOrDefault(x => x.Level == request.Level);

            if (existing is not null)
                return new WishlistImportanceAlreadyExistForLevelException(request.Level);

            return await CreateEntity(request, cancellationToken);
        }

        private async Task<Either<WishlistImportanceException, WishlistImportance>> CreateEntity(
            CreateWishlistImportanceCommand request,
            CancellationToken cancellationToken)
        {
            WishlistImportanceId? id = null;

            try
            {
                var importance = WishlistImportance.Create(
                    name: request.Name,
                    level: request.Level);

                id = importance.Id;

                var created = await importanceRepository.AddAsync(importance, cancellationToken);

                return created;
            }
            catch (Exception ex)
            {
                return new UnhandledWishlistImportanceException(
                    id ?? WishlistImportanceId.Empty(),
                    ex);
            }
        }
    }
}
