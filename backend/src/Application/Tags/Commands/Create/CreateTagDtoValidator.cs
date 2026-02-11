using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Tags.Commands.Create
{
    public class CreateTagCommandValidator : AbstractValidator<CreateTagCommand>
    {
        public CreateTagCommandValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty()
                .WithMessage("Назва тегу є обов'язковою")
                .MaximumLength(100)
                .WithMessage("Назва не може бути довшою за 100 символів");

            RuleFor(x => x.Color)
                .NotEmpty()
                .WithMessage("Колір є обов'язковим")
                .MaximumLength(50)
                .WithMessage("Колір не може бути довшим за 50 символів")
                .Matches("^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$")
                .WithMessage("Колір має бути у форматі HEX (#RRGGBB або #RGB)");

            RuleFor(x => x.CreatedBy)
                .NotEmpty()
                .WithMessage("CreatedBy є обов'язковим");
        }
    }
}