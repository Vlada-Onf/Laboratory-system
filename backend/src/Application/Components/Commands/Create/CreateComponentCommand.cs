using Application.Common.Interfaces.Repositories;
using Application.Components.Exceptions;
using Domain.Categories;
using Domain.Components;
using Domain.Users;
using LanguageExt;
using MediatR;

namespace Application.Components.Commands.Create
{
    public record CreateComponentCommand : IRequest<Either<ComponentException, Component>>
    {
        public required Guid CategoryId { get; init; }      
        public required string Name { get; init; }
        public string? Description { get; init; }
        public required int Quantity { get; init; }
        public required decimal Price { get; init; }
        public required string PhotoUrl { get; init; }
        public required string SupplierLink { get; init; }
        public string? DocumentationLink { get; init; }
        public List<Guid> TagIds { get; init; } = new();
        public required Guid CreatedBy { get; init; }
    }

    public class CreateComponentCommandHandler(
        IComponentRepository componentRepository,
        ICategoryRepository categoryRepository,
        ITagRepository tagRepository)
        : IRequestHandler<CreateComponentCommand, Either<ComponentException, Component>>
    {
        public async Task<Either<ComponentException, Component>> Handle(
            CreateComponentCommand request,
            CancellationToken cancellationToken)
        {
            var categoryId = new CategoryId(request.CategoryId);
            var createdBy = new UserId(request.CreatedBy);  
            var categoryExists = await categoryRepository.ExistsAsync(categoryId, cancellationToken);
            if (!categoryExists)
                return new ComponentCategoryNotFoundException(ComponentId.Empty);

            var existingComponent = await componentRepository.GetByNameAsync(request.Name, cancellationToken);

            return await existingComponent.MatchAsync(
                Some: c => new ComponentAlreadyExistException(c.Id),
                None: () => CreateEntity(request, categoryId, createdBy, cancellationToken));
        }

        private async Task<Either<ComponentException, Component>> CreateEntity(
            CreateComponentCommand request,
            CategoryId categoryId,
            UserId createdBy,
            CancellationToken cancellationToken)
        {
            try
            {
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
                // if (request.TagIds.Any())
                // {
                //     var tags = await tagRepository.GetByIdsAsync(request.TagIds, cancellationToken);
                //     foreach (var tag in tags)
                //     {
                //         component.AddTag(tag);
                //     }
                // }
                var createdComponent = await componentRepository.AddAsync(component, cancellationToken);

                return createdComponent;
            }
            catch (Exception exception)
            {
                return new UnhandledComponentException(ComponentId.Empty, exception);
            }
        }
    }
}
