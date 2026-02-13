using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Wishlists.Commands.Update
{
    public sealed class UpdateWishlistStatusCommandValidator
            : AbstractValidator<UpdateWishlistStatusCommand>
    {
        public UpdateWishlistStatusCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id є обов'язковим");

            RuleFor(x => x.StatusId)
                .NotEmpty().WithMessage("StatusId є обов'язковим");

            RuleFor(x => x.CompletionReason)
                .MaximumLength(1000)
                .When(x => x.CompletionReason is not null);
        }
    }
}
