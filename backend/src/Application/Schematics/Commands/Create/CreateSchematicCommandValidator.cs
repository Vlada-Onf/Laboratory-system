using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Schematics.Commands.Create
{
    public sealed class CreateSchematicCommandValidator
            : AbstractValidator<CreateSchematicCommand>
    {
        public CreateSchematicCommandValidator()
        {
            RuleFor(x => x.ComponentId)
                .NotEmpty().WithMessage("ComponentId є обов'язковим");

            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Назва є обов'язковою")
                .MaximumLength(200).WithMessage("Назва не може бути довшою за 200 символів");

            RuleFor(x => x.Description)
                .MaximumLength(2000)
                .When(x => x.Description is not null);

            RuleFor(x => x.PhotoUrl)
                .MaximumLength(500)
                .When(x => x.PhotoUrl is not null);

            RuleFor(x => x.DocumentUrl)
                .MaximumLength(500)
                .When(x => x.DocumentUrl is not null);

            RuleFor(x => x.AdditionalLinks)
                .MaximumLength(1000)
                .When(x => x.AdditionalLinks is not null);

            RuleFor(x => x.CreatedBy)
                .NotEmpty().WithMessage("CreatedBy є обов'язковим");
        }
    }
}
