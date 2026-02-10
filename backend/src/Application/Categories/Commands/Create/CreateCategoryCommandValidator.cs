using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Categories.Commands.Create
{
    public class CreateCategoryCommandValidator : AbstractValidator<CreateCategoryCommand>
    {
        public CreateCategoryCommandValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty()
                .MaximumLength(255);

            RuleFor(x => x.CreatedBy)
                .NotEmpty();

            RuleFor(x => x.Description)
                .MaximumLength(500);

            RuleFor(x => x.PhotoUrl)
                .MaximumLength(500);

            RuleFor(x => x.CardColor)
                .MaximumLength(50);
        }
    }
}
