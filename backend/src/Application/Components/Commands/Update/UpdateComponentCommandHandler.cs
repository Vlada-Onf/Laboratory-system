using Application.Common.Interfaces.Repositories;
using Application.Components.Exceptions;
using Application.HistoryEntries;
using Domain.Categories;
using Domain.Components;
using Domain.Users;
using LanguageExt;
using MediatR;
using System.Text.Json;

namespace Application.Components.Commands.Update
{
    public class UpdateComponentCommandHandler(
        IComponentRepository componentRepository,
        ICategoryRepository categoryRepository,
        ITagRepository tagRepository,
        IHistoryObserver historyObserver)
        : IRequestHandler<UpdateComponentCommand, Either<ComponentException, Component>>
    {
        public async Task<Either<ComponentException, Component>> Handle(
            UpdateComponentCommand request,
            CancellationToken cancellationToken)
        {
            var componentId = new ComponentId(request.Id);
            var categoryId = new CategoryId(request.CategoryId);

            var categoryExists = await categoryRepository.ExistsAsync(categoryId, cancellationToken);
            if (!categoryExists)
                return new ComponentCategoryNotFoundException(componentId);

            var option = await componentRepository.GetByIdAsync(componentId, cancellationToken);

            return await option.MatchAsync(
                Some: component => UpdateEntity(component, request, categoryId, cancellationToken),
                None: () => Task.FromResult<Either<ComponentException, Component>>(
                    new ComponentNotFoundException(componentId)));
        }

        private async Task<Either<ComponentException, Component>> UpdateEntity(
            Component component,
            UpdateComponentCommand request,
            CategoryId categoryId,
            CancellationToken cancellationToken)
        {
            try
            {
                var oldQuantity = component.Quantity;

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

                var lastUpdatedBy = new UserId(request.LastUpdatedBy);
                component.Update(
                    categoryId: categoryId,
                    name: request.Name,
                    description: request.Description,
                    quantity: request.Quantity,
                    price: request.Price,
                    photoUrl: request.PhotoUrl,
                    supplierLink: request.SupplierLink,
                    documentationLink: request.DocumentationLink,
                    lastUpdatedBy: lastUpdatedBy);

                await componentRepository.ClearComponentTagsAsync(component.Id, cancellationToken);

                var tags = await tagRepository.GetByIdsAsync(request.TagIds, cancellationToken);
                component.Tags.Clear();
                foreach (var tag in tags)
                {
                    component.AddTag(tag);
                }

                var updated = await componentRepository.UpdateAsync(component, cancellationToken);

                var newValues = JsonSerializer.Serialize(new
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

                // 3. Загальний запис "Updated"
                await historyObserver.EntityUpdatedAsync(
                    userId: request.PerformedBy,
                    entityTypeName: "Component",
                    entityId: component.Id.Value.ToString(),
                    oldValues: oldValues,
                    newValues: newValues,
                    cancellationToken: cancellationToken);

                // 4. Якщо змінилась кількість - окремий запис "Quantity changed"
                var newQuantity = component.Quantity;

                if (newQuantity != oldQuantity)
                {
                    var quantityOldValues = JsonSerializer.Serialize(new
                    {
                        component.Id,
                        Quantity = oldQuantity
                    });

                    var quantityNewValues = JsonSerializer.Serialize(new
                    {
                        component.Id,
                        Quantity = newQuantity
                    });

                    await historyObserver.EntityQuantityChangedAsync(
                        userId: request.PerformedBy,
                        entityTypeName: "Component",
                        entityId: component.Id.Value.ToString(),
                        oldValues: quantityOldValues,
                        newValues: quantityNewValues,
                        cancellationToken: cancellationToken);
                }

                return updated;
            }
            catch (Exception exception)
            {
                return new UnhandledComponentException(component.Id, exception);
            }
        }
    }
}