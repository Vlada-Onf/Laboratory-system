using Application.Common.Interfaces.Repositories;
using Application.DamagedComponents.Exceptions;
using Domain.DamagedComponents;
using LanguageExt;
using MediatR;

namespace Application.DamagedComponents.Commands.Delete
{
    public class DeleteDamagedComponentCommandHandler(
        IDamagedComponentRepository damagedComponentRepository)
        : IRequestHandler<DeleteDamagedComponentCommand, Either<DamagedComponentException, MediatR.Unit>>
    {
        public async Task<Either<DamagedComponentException, MediatR.Unit>> Handle(
            DeleteDamagedComponentCommand request,
            CancellationToken cancellationToken)
        {
            var id = new DamagedComponentId(request.Id);
            var option = await damagedComponentRepository.GetByIdAsync(id, cancellationToken);

            return await option.MatchAsync(
                Some: async damaged =>
                {
                    try
                    {
                        await damagedComponentRepository.DeleteAsync(damaged, cancellationToken);
                        return MediatR.Unit.Value;
                    }
                    catch (Exception exception)
                    {
                        return new UnhandledDamagedComponentException(id, exception);
                    }
                },
                None: () => Task.FromResult<Either<DamagedComponentException, MediatR.Unit>>(
                    new DamagedComponentNotFoundException(id)));
        }
    }
}
