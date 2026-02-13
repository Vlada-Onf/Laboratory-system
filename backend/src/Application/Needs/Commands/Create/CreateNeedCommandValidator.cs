using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Needs.Commands.Create
{
    public sealed class CreateNeedCommandValidator
       : AbstractValidator<CreateNeedCommand>
    {
        public CreateNeedCommandValidator()
        {
            RuleFor(x => x.ComponentId)
                .NotEmpty().WithMessage("ComponentId є обов'язковим");

            RuleFor(x => x.QuantityNeeded)
                .GreaterThan(0).WithMessage("Кількість мусить бути більше 0");

            RuleFor(x => x.RequestedBy)
                .NotEmpty().WithMessage("RequestedBy є обов'язковим");

            RuleFor(x => x.ImportanceId)
                .NotEmpty().WithMessage("ImportanceId є обов'язковим");
        }
    }
}