using Application.Categories.Exceptions;
using Domain.Categories;
using LanguageExt;
using MediatR;

namespace Application.Categories.Commands.Create
{
    public record CreateCategoryCommand : IRequest<Either<CategoryException, Category>>
    {
        public required string Name { get; init; }
        public string? Description { get; init; }
        public string? PhotoUrl { get; init; }
        public string? CardColor { get; init; }
        public required Guid CreatedBy { get; init; }
        public required Guid PerformedBy { get; init; }
    }
}