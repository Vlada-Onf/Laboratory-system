using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Components.Commands.Create
{
    public class CreateComponentCommandValidator : AbstractValidator<CreateComponentCommand>
    {
        public CreateComponentCommandValidator()
        {
            RuleFor(x => x.CategoryId)
                .NotEmpty()
                .WithMessage("CategoryId є обов'язковим");

            RuleFor(x => x.Name)
                .NotEmpty()
                .WithMessage("Назва компонента є обов'язковою")
                .MaximumLength(255)
                .WithMessage("Назва не може бути довшою за 255 символів");

            RuleFor(x => x.Quantity)
                .GreaterThanOrEqualTo(0)
                .WithMessage("Кількість не може бути від'ємною");

            RuleFor(x => x.Price)
                .GreaterThanOrEqualTo(0)
                .WithMessage("Ціна не може бути від'ємною");

            RuleFor(x => x.PhotoUrl)
                .NotEmpty()
                .WithMessage("URL фото є обов'язковим")
                .MaximumLength(500);

            RuleFor(x => x.SupplierLink)
                .NotEmpty()
                .WithMessage("Посилання на постачальника є обов'язковим")
                .MaximumLength(500);

            RuleFor(x => x.DocumentationLink)
                .MaximumLength(500)
                .When(x => !string.IsNullOrEmpty(x.DocumentationLink));

            RuleFor(x => x.CreatedBy)
                .NotEmpty()
                .WithMessage("CreatedBy є обов'язковим");
        }
    }

}
