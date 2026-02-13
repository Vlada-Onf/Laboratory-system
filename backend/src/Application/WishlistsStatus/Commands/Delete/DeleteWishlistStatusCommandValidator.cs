using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.WishlistsStatus.Commands.Delete
{
    public sealed class DeleteWishlistStatusCommandValidator
            : AbstractValidator<DeleteWishlistStatusCommand>
    {
        public DeleteWishlistStatusCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id є обов'язковим");
        }
    }
}
