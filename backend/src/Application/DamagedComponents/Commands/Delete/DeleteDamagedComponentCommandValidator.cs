using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DamagedComponents.Commands.Delete
{
    public sealed class DeleteDamagedComponentCommandValidator
         : AbstractValidator<DeleteDamagedComponentCommand>
    {
        public DeleteDamagedComponentCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id є обов'язковим");
        }
    }
}
