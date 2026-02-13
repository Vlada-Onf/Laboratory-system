using Application.Common.Interfaces.Repositories;
using Application.NeedsImportance.Exceptions;
using Domain.Needs.Importance;
using LanguageExt;
using MediatR;

namespace Application.NeedsImportance.Commands.Create
{
    public sealed class CreateNeedImportanceCommandHandler(
        INeedImportanceRepository importanceRepository)
        : IRequestHandler<CreateNeedImportanceCommand, Either<NeedImportanceException, NeedImportance>>
    {
        public async Task<Either<NeedImportanceException, NeedImportance>> Handle(
            CreateNeedImportanceCommand request,
            CancellationToken cancellationToken)
        {
            var existing = await importanceRepository.GetByLevelAsync(
                request.Level,
                cancellationToken);

            return await existing.MatchAsync(
                Some: _ => Task.FromResult<Either<NeedImportanceException, NeedImportance>>(
                    new NeedImportanceAlreadyExistForLevelException(request.Level)),
                None: () => CreateEntity(request, cancellationToken));
        }

        private async Task<Either<NeedImportanceException, NeedImportance>> CreateEntity(
            CreateNeedImportanceCommand request,
            CancellationToken cancellationToken)
        {
            NeedImportanceId? id = null;

            try
            {
                var importance = NeedImportance.Create(
                    name: request.Name,
                    level: request.Level);

                id = importance.Id;

                var created = await importanceRepository.AddAsync(importance, cancellationToken);

                return created;
            }
            catch (Exception ex)
            {
                return new UnhandledNeedImportanceException(
                    id ?? NeedImportanceId.Empty(),
                    ex);
            }
        }
    }
}