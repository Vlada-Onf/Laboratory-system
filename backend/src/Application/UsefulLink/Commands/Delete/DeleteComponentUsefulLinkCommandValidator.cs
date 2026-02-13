using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.UsefulLink.Commands.Delete
{
    public sealed class DeleteComponentUsefulLinkCommandValidator
            : AbstractValidator<DeleteComponentUsefulLinkCommand>
    {
        public DeleteComponentUsefulLinkCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id є обов'язковим");
        }
    }
}
