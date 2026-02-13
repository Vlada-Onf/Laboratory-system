using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Schematics.Commands.Delete
{
    public sealed class DeleteSchematicCommandValidator
            : AbstractValidator<DeleteSchematicCommand>
    {
        public DeleteSchematicCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id є обов'язковим");
        }
    }
}
