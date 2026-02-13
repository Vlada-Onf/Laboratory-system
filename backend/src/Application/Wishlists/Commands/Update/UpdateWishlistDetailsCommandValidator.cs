using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Wishlists.Commands.Update
{
    public sealed class UpdateWishlistDetailsCommandValidator
            : AbstractValidator<UpdateWishlistDetailsCommand>
    {
        public UpdateWishlistDetailsCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id є обов'язковим");

            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Name є обов'язковим")
                .MaximumLength(200);

            RuleFor(x => x.Description)
                .MaximumLength(1000)
                .When(x => x.Description is not null);

            RuleFor(x => x.QuantityNeeded)
                .GreaterThan(0).WithMessage("QuantityNeeded мусить бути більше 0");

            RuleFor(x => x.ImportanceId)
                .NotEmpty().WithMessage("ImportanceId є обов'язковим");
        }
    }
}
