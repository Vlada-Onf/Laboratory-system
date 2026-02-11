using Application.Common.Interfaces.Repositories;
using Application.DamagedComponents.Exceptions;
using Domain.DamagedComponents;
using LanguageExt;
using MediatR;

namespace Application.DamagedComponents.Commands.Delete
{
    public sealed class DeleteDamagedComponentCommandHandler(
        IDamagedComponentRepository damagedComponentRepository)
        : IRequestHandler<DeleteDamagedComponentCommand, Either<DamagedComponentException, DamagedComponent>>
    {
        public async Task<Either<DamagedComponentException, DamagedComponent>> Handle(
            DeleteDamagedComponentCommand request,
            CancellationToken cancellationToken)
        {
            var damagedId = new DamagedComponentId(request.Id);
            var option = await damagedComponentRepository.GetByIdAsync(damagedId, cancellationToken);

            return await option.MatchAsync(
                Some: damaged => DeleteEntity(damaged, cancellationToken),
                None: () => Task.FromResult<Either<DamagedComponentException, DamagedComponent>>(
                    new DamagedComponentNotFoundException(damagedId)));
        }

        private async Task<Either<DamagedComponentException, DamagedComponent>> DeleteEntity(
            DamagedComponent damaged,
            CancellationToken cancellationToken)
        {
            try
            {
                var deleted = await damagedComponentRepository.DeleteAsync(damaged, cancellationToken);
                return deleted;
            }
            catch (Exception ex)
            {
                return new UnhandledDamagedComponentException(damaged.Id, ex);
            }
        }
    }
}