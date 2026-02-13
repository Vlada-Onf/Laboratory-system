using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.WishlistsStatus.Commands.Update
{
    public sealed class UpdateWishlistStatusCommandValidator
            : AbstractValidator<UpdateWishlistStatusCommand>
    {
        public UpdateWishlistStatusCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id є обов'язковим");

            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Name є обов'язковим")
                .MaximumLength(200);

            RuleFor(x => x.Description)
                .MaximumLength(1000)
                .When(x => x.Description is not null);
        }
    }
}
