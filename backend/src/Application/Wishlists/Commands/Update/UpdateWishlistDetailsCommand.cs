using Application.Wishlists.Exceptions;
using Domain.Wishlists;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Wishlists.Commands.Update
{
    public sealed record UpdateWishlistDetailsCommand
            : IRequest<Either<WishlistException, Wishlist>>
    {
        public required Guid Id { get; init; }
        public required string Name { get; init; }
        public string? Description { get; init; }
        public required int QuantityNeeded { get; init; }
        public required Guid ImportanceId { get; init; }
        public required Guid PerformedBy { get; init; }
    }
}
