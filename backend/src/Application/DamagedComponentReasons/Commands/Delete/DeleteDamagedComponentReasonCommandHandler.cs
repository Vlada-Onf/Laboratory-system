using Application.Common.Interfaces.Repositories;
using Application.DamagedComponentReasons.Exceptions;
using Application.HistoryEntries;
using Domain.DamagedComponents.Reason;
using LanguageExt;
using MediatR;
using System.Text.Json;

namespace Application.DamagedComponentReasons.Commands.Delete
{
    public sealed class DeleteDamagedComponentReasonCommandHandler(
        IDamagedComponentReasonRepository reasonRepository,
        IHistoryObserver historyObserver)
        : IRequestHandler<DeleteDamagedComponentReasonCommand, Either<DamagedComponentReasonException, DamagedComponentReason>>
    {
        public async Task<Either<DamagedComponentReasonException, DamagedComponentReason>> Handle(
            DeleteDamagedComponentReasonCommand request,
            CancellationToken cancellationToken)
        {
            var reasonId = new DamagedComponentReasonId(request.Id);
            var option = await reasonRepository.GetByIdAsync(reasonId, cancellationToken);

            return await option.MatchAsync(
                Some: reason => DeleteEntity(reason, request.PerformedBy, cancellationToken),
                None: () => Task.FromResult<Either<DamagedComponentReasonException, DamagedComponentReason>>(
                    new DamagedComponentReasonNotFoundException(reasonId)));
        }

        private async Task<Either<DamagedComponentReasonException, DamagedComponentReason>> DeleteEntity(
            DamagedComponentReason reason,
            Guid performedBy,
            CancellationToken cancellationToken)
        {
            // 1. Безпечна підготовка oldValues ДО видалення
            string oldValues;
            try
            {
                var safeSnapshot = new
                {
                    Id = reason.Id.Value.ToString(),
                    Name = reason.Name ?? string.Empty,
                    Description = reason.Description ?? string.Empty
                };

                oldValues = JsonSerializer.Serialize(safeSnapshot);
            }
            catch (Exception ex)
            {
                // Якщо навіть серіалізація впала – не валимо delete, просто логування буде пустим
                oldValues = $"\"SerializationFailed: {ex.GetType().Name}\"";
            }

            DamagedComponentReason? deletedEntity;
            try
            {
                // 2. Реальне видалення з репозиторію
                deletedEntity = await reasonRepository.DeleteAsync(reason, cancellationToken);
            }
            catch (Exception ex)
            {
                // 3. Якщо саме видалення не вдалось – це вже реальна помилка
                return new UnhandledDamagedComponentReasonException(reason.Id, ex);
            }

            // 4. Логування історії НЕ повинно валити бізнес-операцію
            try
            {
                await historyObserver.EntityDeletedAsync(
                    userId: performedBy,
                    entityTypeName: "DamagedComponentReason",
                    entityId: reason.Id.Value.ToString(),
                    oldValues: oldValues,
                    cancellationToken: cancellationToken);
            }
            catch (Exception)
            {

            }

            return deletedEntity!;
        }
    }
}
