using Application.Common.Interfaces.Repositories;
using Application.Components.Exceptions;
using Application.HistoryEntries;
using Domain.Categories;
using Domain.Components;
using Domain.Users;
using LanguageExt;
using MediatR;
using System.Text.Json;

namespace Application.Components.Commands.Create
{
    public class CreateComponentCommandHandler(
        IComponentRepository componentRepository,
        ICategoryRepository categoryRepository,
        ITagRepository tagRepository,
        IHistoryObserver historyObserver)
        : IRequestHandler<CreateComponentCommand, Either<ComponentException, Component>>
    {
        public async Task<Either<ComponentException, Component>> Handle(
            CreateComponentCommand request,
            CancellationToken cancellationToken)
        {
            var categoryId = new CategoryId(request.CategoryId);

            var categoryExists = await categoryRepository.ExistsAsync(categoryId, cancellationToken);
            if (!categoryExists)
                return new ComponentCategoryNotFoundException(ComponentId.Empty());

            var existingComponent = await componentRepository.GetByNameAsync(
                request.Name,
                cancellationToken);

            return await existingComponent.MatchAsync(
                Some: c => new ComponentAlreadyExistException(c.Id),
                None: () => CreateEntity(request, categoryId, cancellationToken));
        }

        private async Task<Either<ComponentException, Component>> CreateEntity(
            CreateComponentCommand request,
            CategoryId categoryId,
            CancellationToken cancellationToken)
        {
            try
            {
                var createdBy = new UserId(request.CreatedBy);

                var component = Component.Create(
                    categoryId: categoryId,
                    name: request.Name,
                    description: request.Description,
                    quantity: request.Quantity,
                    price: request.Price,
                    photoUrl: request.PhotoUrl,
                    supplierLink: request.SupplierLink,
                    documentationLink: request.DocumentationLink,
                    createdBy: createdBy);

                var tagIds = request.TagIds
                    .Where(id => id != Guid.Empty)
                    .Distinct()
                    .ToList();

                if (tagIds.Any())
                {
                    var tags = await tagRepository.GetByIdsAsync(tagIds, cancellationToken);

                    foreach (var tag in tags)
                    {
                        component.AddTag(tag);
                    }
                }

                var created = await componentRepository.AddAsync(component, cancellationToken);

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
                    component.CreatedBy
                });

                await historyObserver.EntityCreatedAsync(
                    userId: request.PerformedBy,
                    entityTypeName: "Component",
                    entityId: component.Id.Value.ToString(),
                    newValues: newValues,
                    cancellationToken: cancellationToken);

                return created;
            }
            catch (Exception ex)
            {
                return new UnhandledComponentException(ComponentId.Empty(), ex);
            }
        }
    }
}
