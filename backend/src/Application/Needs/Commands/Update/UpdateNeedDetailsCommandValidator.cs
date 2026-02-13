using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Needs.Commands.Update
{
    public sealed class UpdateNeedDetailsCommandValidator
        : AbstractValidator<UpdateNeedDetailsCommand>
    {
        public UpdateNeedDetailsCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id є обов'язковим");

            RuleFor(x => x.QuantityNeeded)
                .GreaterThan(0).WithMessage("Кількість мусить бути більше 0");

            RuleFor(x => x.ImportanceId)
                .NotEmpty().WithMessage("ImportanceId є обов'язковим");
        }
    }
}
