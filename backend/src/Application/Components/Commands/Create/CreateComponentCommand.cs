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
        public required Guid PerformedBy { get; init; }
    }
}
