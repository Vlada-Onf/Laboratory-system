using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.NeedsStatus.Commands.Update
{
    public sealed class UpdateNeedStatusCommandValidator
            : AbstractValidator<UpdateNeedStatusCommand>
    {
        public UpdateNeedStatusCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id є обов'язковим");

            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Назва є обов'язковою")
                .MaximumLength(200).WithMessage("Назва не може бути довшою за 200 символів");

            RuleFor(x => x.Description)
                .MaximumLength(1000)
                .When(x => x.Description is not null);
        }
    }
}