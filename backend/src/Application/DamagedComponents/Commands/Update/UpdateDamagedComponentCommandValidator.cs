using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DamagedComponents.Commands.Update
{
    public class UpdateDamagedComponentCommandValidator
        : AbstractValidator<UpdateDamagedComponentCommand>
    {
        public UpdateDamagedComponentCommandValidator()
        {
            RuleFor(x => x.Id).NotEmpty();
            RuleFor(x => x.ComponentId).NotEmpty();
            RuleFor(x => x.ReasonId).NotEmpty();
            RuleFor(x => x.Quantity).GreaterThan(0);
            RuleFor(x => x.LastUpdatedBy).NotEmpty();
        }
    }
}
