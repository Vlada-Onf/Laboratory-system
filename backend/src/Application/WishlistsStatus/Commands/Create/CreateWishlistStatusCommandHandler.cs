using Application.Common.Interfaces.Repositories;
using Application.HistoryEntries;
using Application.WishlistsStatus.Exceptions;
using Domain.Wishlists.Status;
using LanguageExt;
using MediatR;
using System.Text.Json;

namespace Application.WishlistsStatus.Commands.Create
{
    public sealed class CreateWishlistStatusCommandHandler(
        IWishlistStatusRepository statusRepository,
        IHistoryObserver historyObserver)
        : IRequestHandler<CreateWishlistStatusCommand, Either<WishlistStatusException, WishlistStatus>>
    {
        public async Task<Either<WishlistStatusException, WishlistStatus>> Handle(
            CreateWishlistStatusCommand request,
            CancellationToken cancellationToken)
        {
            return await CreateEntity(request, cancellationToken);
        }

        private async Task<Either<WishlistStatusException, WishlistStatus>> CreateEntity(
            CreateWishlistStatusCommand request,
            CancellationToken cancellationToken)
        {
            WishlistStatusId? id = null;

            try
            {
                var status = WishlistStatus.Create(
                    name: request.Name,
                    description: request.Description);

                id = status.Id;

                var created = await statusRepository.AddAsync(status, cancellationToken);

                var newValues = JsonSerializer.Serialize(new
                {
                    status.Id,
                    status.Name,
                    status.Description,
                    status.CreatedAt
                });

                await historyObserver.EntityCreatedAsync(
                    userId: request.PerformedBy,
                    entityTypeName: "WishlistStatus",
                    entityId: status.Id.Value.ToString(),
                    newValues: newValues,
                    cancellationToken: cancellationToken);

                return created;
            }
            catch (Exception ex)
            {
                return new UnhandledWishlistStatusException(
                    id ?? WishlistStatusId.Empty(),
                    ex);
            }
        }
    }
}
