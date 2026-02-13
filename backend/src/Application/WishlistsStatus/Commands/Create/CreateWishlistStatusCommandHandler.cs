using Application.Common.Interfaces.Repositories;
using Application.WishlistsStatus.Exceptions;
using Domain.Wishlists.Status;
using LanguageExt;
using MediatR;

namespace Application.WishlistsStatus.Commands.Create
{
    public sealed class CreateWishlistStatusCommandHandler(
            IWishlistStatusRepository statusRepository)
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
