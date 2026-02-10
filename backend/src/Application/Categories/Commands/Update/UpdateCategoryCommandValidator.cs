using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Categories.Commands.Update
{
    public class UpdateCategoryCommandValidator : AbstractValidator<UpdateCategoryCommand>
    {
        public UpdateCategoryCommandValidator()
        {
            RuleFor(x => x.Id).NotEmpty();

            RuleFor(x => x.Name)
                .NotEmpty()
                .MaximumLength(255);

            RuleFor(x => x.Description)
                .MaximumLength(500);

            RuleFor(x => x.PhotoUrl)
                .MaximumLength(500);

            RuleFor(x => x.CardColor)
                .MaximumLength(50);

            RuleFor(x => x.LastUpdatedBy)
                .NotEmpty();
        }
    }
}
