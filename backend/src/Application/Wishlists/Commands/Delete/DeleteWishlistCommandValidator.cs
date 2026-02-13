using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Wishlists.Commands.Delete
{
    public sealed class DeleteWishlistCommandValidator
            : AbstractValidator<DeleteWishlistCommand>
    {
        public DeleteWishlistCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id є обов'язковим");
        }
    }
}
