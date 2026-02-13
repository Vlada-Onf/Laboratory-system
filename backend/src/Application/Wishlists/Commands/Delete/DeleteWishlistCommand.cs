using Application.Wishlists.Exceptions;
using Domain.Wishlists;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Wishlists.Commands.Delete
{
    public sealed record DeleteWishlistCommand(Guid Id)
            : IRequest<Either<WishlistException, Wishlist>>;
}
