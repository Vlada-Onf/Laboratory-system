using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Schematics.Commands.Update
{
    public sealed class UpdateSchematicCommandValidator
        : AbstractValidator<UpdateSchematicCommand>
    {
        public UpdateSchematicCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id є обов'язковим");

            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Назва є обов'язковою")
                .MaximumLength(200);

            RuleFor(x => x.Description)
                .MaximumLength(2000)
                .When(x => x.Description is not null);

            RuleFor(x => x.PhotoUrl)
                .MaximumLength(500)
                .When(x => x.PhotoUrl is not null);

            RuleFor(x => x.DocumentUrl)
                .MaximumLength(500)
                .When(x => x.DocumentUrl is not null);

            RuleFor(x => x.UsefulLinkId)
                .NotEmpty().WithMessage("UsefulLinkId є обов'язковим");

            RuleFor(x => x.UpdatedBy)
                .NotEmpty().WithMessage("UpdatedBy є обов'язковим");
        }
    }
}
