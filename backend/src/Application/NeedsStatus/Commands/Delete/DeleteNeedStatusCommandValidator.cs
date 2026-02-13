using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.NeedsStatus.Commands.Delete
{
    public sealed class DeleteNeedStatusCommandValidator
           : AbstractValidator<DeleteNeedStatusCommand>
    {
        public DeleteNeedStatusCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id є обов'язковим");
        }
    }
}
