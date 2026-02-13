using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.NeedsImportance.Commands.Delete
{
    public sealed class DeleteNeedImportanceCommandValidator
            : AbstractValidator<DeleteNeedImportanceCommand>
    {
        public DeleteNeedImportanceCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id є обов'язковим");
        }
    }
}
