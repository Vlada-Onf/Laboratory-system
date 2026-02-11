using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Actions.Commands.Delete
{
    public sealed class DeleteActionCommandValidator
        : AbstractValidator<DeleteActionCommand>
    {
        public DeleteActionCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id є обов'язковим");
        }
    }
}