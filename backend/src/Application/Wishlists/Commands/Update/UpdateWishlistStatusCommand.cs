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
    public sealed record UpdateWishlistStatusCommand
            : IRequest<Either<WishlistException, Wishlist>>
    {
        public required Guid Id { get; init; }
        public required Guid StatusId { get; init; }
        public string? CompletionReason { get; init; }
        public required Guid PerformedBy { get; init; }
    }
}
