using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Wishlists.Commands.Create
{
    public sealed class CreateWishlistCommandValidator
            : AbstractValidator<CreateWishlistCommand>
    {
        public CreateWishlistCommandValidator()
        {
            RuleFor(x => x.ComponentId)
                .NotEmpty().WithMessage("ComponentId є обов'язковим");

            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Name є обов'язковим")
                .MaximumLength(200);

            RuleFor(x => x.Description)
                .MaximumLength(1000)
                .When(x => x.Description is not null);

            RuleFor(x => x.QuantityNeeded)
                .GreaterThan(0).WithMessage("QuantityNeeded мусить бути більше 0");

            RuleFor(x => x.RequestedBy)
                .NotEmpty().WithMessage("RequestedBy є обов'язковим");

            RuleFor(x => x.ImportanceId)
                .NotEmpty().WithMessage("ImportanceId є обов'язковим");

            RuleFor(x => x.StatusId)
                .NotEmpty().WithMessage("StatusId є обов'язковим");
        }
    }
}
