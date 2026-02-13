using Application.Wishlists.Exceptions;
using Domain.Wishlists;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Wishlists.Commands.Create
{
    public sealed record CreateWishlistCommand
            : IRequest<Either<WishlistException, Wishlist>>
    {
        public required Guid ComponentId { get; init; }
        public required string Name { get; init; }
        public string? Description { get; init; }
        public required int QuantityNeeded { get; init; }
        public required Guid RequestedBy { get; init; }
        public required Guid ImportanceId { get; init; }
        public required Guid StatusId { get; init; }
    }
}
