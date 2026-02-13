using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.HistoryEntries.Commands.Create
{
    public sealed class CreateHistoryCommandValidator
        : AbstractValidator<CreateHistoryCommand>
    {
        public CreateHistoryCommandValidator()
        {
            RuleFor(x => x.UserId)
                .NotEmpty().WithMessage("UserId є обов'язковим");

            RuleFor(x => x.ActionId)
                .NotEmpty().WithMessage("ActionId є обов'язковим");

            RuleFor(x => x.EntityTypeId)
                .NotEmpty().WithMessage("EntityTypeId є обов'язковим");

            RuleFor(x => x.EntityId)
                .NotEmpty().WithMessage("EntityId є обов'язковим")
                .MaximumLength(200).WithMessage("EntityId не може бути довшим за 200 символів");
        }
    }
}