using Application.Common.Interfaces.Repositories;
using Application.WishlistsImportance.Exceptions;
using Domain.Wishlists.Importance;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.WishlistsImportance.Commands.Delete
{
    public sealed record DeleteWishlistImportanceCommand(Guid Id)
            : IRequest<Either<WishlistImportanceException, WishlistImportance>>;
}
