using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.UsefulLink.Commands.Update
{
    public sealed class UpdateComponentUsefulLinkCommandValidator
            : AbstractValidator<UpdateComponentUsefulLinkCommand>
    {
        public UpdateComponentUsefulLinkCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id є обов'язковим");

            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Назва є обов'язковою")
                .MaximumLength(200);

            RuleFor(x => x.Url)
                .NotEmpty().WithMessage("Посилання є обов'язковим")
                .MaximumLength(1000);

            RuleFor(x => x.UpdatedBy)
                .NotEmpty().WithMessage("UpdatedBy є обов'язковим");
        }
    }
}
