using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DamagedComponentReasons.Commands.Delete
{
    public sealed class DeleteDamagedComponentReasonCommandValidator
        : AbstractValidator<DeleteDamagedComponentReasonCommand>
    {
        public DeleteDamagedComponentReasonCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id є обов'язковим");
        }
    }
}
