using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Components.Commands.Delete
{
    public class DeleteComponentCommandValidator : AbstractValidator<DeleteComponentCommand>
    {
        public DeleteComponentCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty()
                .WithMessage("Id є обов'язковим");
        }
    }
}
