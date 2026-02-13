using Application.WishlistsImportance.Exceptions;
using Domain.Wishlists.Importance;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.WishlistsImportance.Commands.Update
{
    public sealed record UpdateWishlistImportanceCommand
            : IRequest<Either<WishlistImportanceException, WishlistImportance>>
    {
        public required Guid Id { get; init; }
        public required string Name { get; init; }
        public required int Level { get; init; }
    }
}
