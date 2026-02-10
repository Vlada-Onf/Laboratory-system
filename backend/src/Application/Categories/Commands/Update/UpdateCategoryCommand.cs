using Application.Categories.Exceptions;
using Domain.Categories;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Categories.Commands.Update
{
    public record UpdateCategoryCommand : IRequest<Either<CategoryException, Category>>
    {
        public required Guid Id { get; init; }
        public required string Name { get; init; }
        public string? Description { get; init; }
        public string? PhotoUrl { get; init; }
        public string? CardColor { get; init; }
        public required Guid LastUpdatedBy { get; init; }
    }
}
