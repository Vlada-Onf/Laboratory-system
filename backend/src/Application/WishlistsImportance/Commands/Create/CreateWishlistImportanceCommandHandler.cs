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

namespace Application.WishlistsImportance.Commands.Create
{
    public sealed class CreateWishlistImportanceCommandHandler(
        IWishlistImportanceRepository importanceRepository,
        ILogger<CreateWishlistImportanceCommandHandler> logger)
    : IRequestHandler<CreateWishlistImportanceCommand, Either<WishlistImportanceException, WishlistImportance>>
    {
        public async Task<Either<WishlistImportanceException, WishlistImportance>> Handle(
            CreateWishlistImportanceCommand request,
            CancellationToken cancellationToken)
        {
            logger.LogInformation("CreateWishlistImportance started with Name={Name}, Level={Level}",
                request.Name, request.Level);

            var all = await importanceRepository.GetAllAsync(cancellationToken);
            logger.LogInformation("Found {Count} existing importances", all.Count);

            var existing = all.FirstOrDefault(x => x.Level == request.Level);

            if (existing is not null)
            {
                logger.LogWarning("Importance with Level={Level} already exists (Id={Id})",
                    request.Level, existing.Id.Value);
                return new WishlistImportanceAlreadyExistForLevelException(request.Level);
            }

            return await CreateEntity(request, cancellationToken);
        }

        private async Task<Either<WishlistImportanceException, WishlistImportance>> CreateEntity(
            CreateWishlistImportanceCommand request,
            CancellationToken cancellationToken)
        {
            WishlistImportanceId? id = null;

            try
            {
                logger.LogInformation("Creating WishlistImportance entity");

                var importance = WishlistImportance.Create(
                    name: request.Name,
                    level: request.Level);

                id = importance.Id;

                var created = await importanceRepository.AddAsync(importance, cancellationToken);

                logger.LogInformation("WishlistImportance created with Id={Id}", created.Id.Value);

                return created;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error while creating WishlistImportance (temp Id={Id})", id?.Value);
                return new UnhandledWishlistImportanceException(
                    id ?? WishlistImportanceId.Empty(),
                    ex);
            }
        }
    }
}
