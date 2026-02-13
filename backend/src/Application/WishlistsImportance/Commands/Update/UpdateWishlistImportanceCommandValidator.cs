using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.WishlistsImportance.Commands.Update
{
    public sealed class UpdateWishlistImportanceCommandValidator
            : AbstractValidator<UpdateWishlistImportanceCommand>
    {
        public UpdateWishlistImportanceCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id є обов'язковим");

            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Назва є обов'язковою")
                .MaximumLength(200);

            RuleFor(x => x.Level)
                .InclusiveBetween(1, 3).WithMessage("Level мусить бути від 1 до 3");
        }
    }
}
