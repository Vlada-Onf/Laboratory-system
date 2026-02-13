using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.WishlistsImportance.Commands.Delete
{
    public sealed class DeleteWishlistImportanceCommandValidator
            : AbstractValidator<DeleteWishlistImportanceCommand>
    {
        public DeleteWishlistImportanceCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id є обов'язковим");
        }
    }
}
