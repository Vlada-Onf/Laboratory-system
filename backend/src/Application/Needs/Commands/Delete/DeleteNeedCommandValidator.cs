using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Needs.Commands.Delete
{
    public sealed class DeleteNeedCommandValidator
        : AbstractValidator<DeleteNeedCommand>
    {
        public DeleteNeedCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id є обов'язковим");
        }
    }
}
