using Application.WishlistsStatus.Exceptions;
using Domain.Wishlists.Status;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.WishlistsStatus.Commands.Delete
{
    public sealed record DeleteWishlistStatusCommand(Guid Id)
            : IRequest<Either<WishlistStatusException, WishlistStatus>>;
}
