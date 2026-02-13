using Application.WishlistsStatus.Exceptions;
using Domain.Wishlists.Status;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.WishlistsStatus.Commands.Create
{
    public sealed record CreateWishlistStatusCommand
            : IRequest<Either<WishlistStatusException, WishlistStatus>>
    {
        public required string Name { get; init; }
        public string? Description { get; init; }
    }
}
