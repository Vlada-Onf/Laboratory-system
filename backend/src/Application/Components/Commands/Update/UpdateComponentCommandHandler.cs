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
    public class UpdateComponentCommandHandler(
        IComponentRepository componentRepository,
        ICategoryRepository categoryRepository)
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

                var updated = await componentRepository.UpdateAsync(component, cancellationToken);

                return updated;
            }
            catch (Exception exception)
            {
                return new UnhandledComponentException(component.Id, exception);
            }
        }
    }
}