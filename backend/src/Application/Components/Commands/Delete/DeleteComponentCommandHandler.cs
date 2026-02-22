using Application.Common.Interfaces.Repositories;
using Application.Components.Exceptions;
using Application.HistoryEntries;
using Domain.Components;
using LanguageExt;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using System.Text.Json;

namespace Application.Components.Commands.Delete
{
    public class DeleteComponentCommandHandler(
        IComponentRepository componentRepository,
        IHistoryObserver historyObserver)
        : IRequestHandler<DeleteComponentCommand, Either<ComponentException, Component>>
    {
        public async Task<Either<ComponentException, Component>> Handle(
            DeleteComponentCommand request,
            CancellationToken cancellationToken)
        {
            var componentId = new ComponentId(request.Id);
            var option = await componentRepository.GetByIdAsync(componentId, cancellationToken);

            return await option.MatchAsync(
                Some: component => DeleteEntity(component, request.PerformedBy, cancellationToken),
                None: () => Task.FromResult<Either<ComponentException, Component>>(
                    new ComponentNotFoundException(componentId)));
        }

        private async Task<Either<ComponentException, Component>> DeleteEntity(
            Component component,
            Guid performedBy,
            CancellationToken cancellationToken)
        {
            try
            {
                var oldValues = JsonSerializer.Serialize(new
                {
                    component.Id,
                    component.CategoryId,
                    component.Name,
                    component.Description,
                    component.Quantity,
                    component.Price,
                    component.TotalCost,
                    component.PhotoUrl,
                    component.SupplierLink,
                    component.DocumentationLink,
                    component.CreatedAt,
                    component.CreatedBy,
                    component.LastUpdatedAt,
                    component.LastUpdatedBy
                });

                var deleted = await componentRepository.DeleteAsync(component, cancellationToken);

                await historyObserver.EntityDeletedAsync(
                    userId: performedBy,
                    entityTypeName: "Component",
                    entityId: component.Id.Value.ToString(),
                    oldValues: oldValues,
                    cancellationToken: cancellationToken);

                return deleted;
            }
            catch (DbUpdateException ex) when (ex.InnerException is PostgresException pg && pg.SqlState == "23503")
            {
                return new ComponentDeleteForbiddenException(
                    component.Id,
                    "Компонент має пов’язані записи і не може бути видалений.");
            }
            catch (Exception exception)
            {
                return new UnhandledComponentException(component.Id, exception);
            }
        }
    }
}
