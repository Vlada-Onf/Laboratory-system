using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.EntityTypes.Commands.Delete
{
    public sealed class DeleteEntityTypeCommandValidator
        : AbstractValidator<DeleteEntityTypeCommand>
    {
        public DeleteEntityTypeCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id є обов'язковим");
        }
    }
}
