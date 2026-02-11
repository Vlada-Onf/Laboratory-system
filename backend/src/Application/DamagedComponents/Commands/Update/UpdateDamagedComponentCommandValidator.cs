using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DamagedComponents.Commands.Update
{
    public sealed class UpdateDamagedComponentCommandValidator
            : AbstractValidator<UpdateDamagedComponentCommand>
    {
        public UpdateDamagedComponentCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id є обов'язковим");

            RuleFor(x => x.ComponentId)
                .NotEmpty().WithMessage("ComponentId є обов'язковим");

            RuleFor(x => x.ReasonId)
                .NotEmpty().WithMessage("ReasonId є обов'язковим");

            RuleFor(x => x.Quantity)
                .GreaterThan(0).WithMessage("Кількість має бути більшою за 0");

            RuleFor(x => x.LastUpdatedBy)
                .NotEmpty().WithMessage("LastUpdatedBy є обов'язковим");
        }
    }
}
