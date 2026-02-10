using Application.Common.Interfaces.Repositories;
using Application.Components.Exceptions;
using Domain.Categories;
using Domain.Components;
using Domain.Users;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Components.Commands.Update
{
    public record UpdateComponentCommand : IRequest<Either<ComponentException, Component>>
    {
        public required Guid Id { get; init; }
        public required Guid CategoryId { get; init; } 
        public required string Name { get; init; }
        public string? Description { get; init; }
        public required int Quantity { get; init; }
        public required decimal Price { get; init; }
        public required string PhotoUrl { get; init; }
        public required string SupplierLink { get; init; }
        public string? DocumentationLink { get; init; }
        public List<Guid> TagIds { get; init; } = new();
        public required Guid UpdatedBy { get; init; }
    }

    public class UpdateComponentCommandHandler(
        IComponentRepository componentRepository,
        ICategoryRepository categoryRepository,
        ITagRepository tagRepository)
        : IRequestHandler<UpdateComponentCommand, Either<ComponentException, Component>>
    {
        public async Task<Either<ComponentException, Component>> Handle(
            UpdateComponentCommand request,
            CancellationToken cancellationToken)
        {
            var componentId = new ComponentId(request.Id);

            var componentOption = await componentRepository.GetByIdAsync(componentId, cancellationToken);

            return await componentOption.MatchAsync(
                Some: component => UpdateEntity(component, request, cancellationToken),
                None: () => Task.FromResult<Either<ComponentException, Component>>(
                    new ComponentNotFoundException(componentId)));
        }

        private async Task<Either<ComponentException, Component>> UpdateEntity(
        Component component,
        UpdateComponentCommand request,
        CancellationToken cancellationToken)
        {
            try
            {
                var categoryId = new CategoryId(request.CategoryId);
                var updatedBy = new UserId(request.UpdatedBy);
                var categoryExists = await categoryRepository.ExistsAsync(categoryId, cancellationToken);
                if (!categoryExists)
                    return new ComponentCategoryNotFoundException(component.Id);

                component.Update(
                    categoryId: categoryId,                           
                    name: request.Name,
                    description: request.Description,
                    quantity: request.Quantity,
                    price: request.Price,
                    photoUrl: request.PhotoUrl,
                    supplierLink: request.SupplierLink,
                    documentationLink: request.DocumentationLink,
                    lastUpdatedBy: updatedBy);

                component.Tags.Clear();
                if (request.TagIds.Any())
                {
                    var tags = await tagRepository.GetByIdsAsync(request.TagIds, cancellationToken);
                    foreach (var tag in tags)
                    {
                        component.AddTag(tag);
                    }
                }

                var updatedComponent = await componentRepository.UpdateAsync(component, cancellationToken);

                return updatedComponent;
            }
            catch (Exception exception)
            {
                return new UnhandledComponentException(component.Id, exception);
            }
        }
    }
}
