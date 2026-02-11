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
        public required Guid LastUpdatedBy { get; init; }
    }
}
