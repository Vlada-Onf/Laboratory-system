using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.NeedsImportance.Commands.Update
{
    public sealed class UpdateNeedImportanceCommandValidator
           : AbstractValidator<UpdateNeedImportanceCommand>
    {
        public UpdateNeedImportanceCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id є обов'язковим");

            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Назва є обов'язковою")
                .MaximumLength(200).WithMessage("Назва не може бути довшою за 200 символів");

            RuleFor(x => x.Level)
                .InclusiveBetween(1, 4).WithMessage("Рівень мусить бути від 1 до 4");
        }
    }
}