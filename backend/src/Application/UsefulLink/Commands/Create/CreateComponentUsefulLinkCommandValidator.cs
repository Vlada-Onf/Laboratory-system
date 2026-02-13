using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.UsefulLink.Commands.Create
{
    public sealed class CreateComponentUsefulLinkCommandValidator
            : AbstractValidator<CreateComponentUsefulLinkCommand>
    {
        public CreateComponentUsefulLinkCommandValidator()
        {
            RuleFor(x => x.ComponentId)
                .NotEmpty().WithMessage("ComponentId є обов'язковим");

            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Назва є обов'язковою")
                .MaximumLength(200);

            RuleFor(x => x.Url)
                .NotEmpty().WithMessage("Посилання є обов'язковим")
                .MaximumLength(1000);

            RuleFor(x => x.CreatedBy)
                .NotEmpty().WithMessage("CreatedBy є обов'язковим");
        }
    }
}
