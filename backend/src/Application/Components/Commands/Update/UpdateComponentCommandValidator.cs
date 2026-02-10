using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Components.Commands.Update
{
    public class UpdateComponentCommandValidator : AbstractValidator<UpdateComponentCommand>
    {
        public UpdateComponentCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty()
                .WithMessage("Id є обов'язковим");

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
                .MaximumLength(500);

            RuleFor(x => x.SupplierLink)
                .NotEmpty()
                .MaximumLength(500);

            RuleFor(x => x.UpdatedBy)
                .NotEmpty()
                .WithMessage("UpdatedBy є обов'язковим");
        }
    }
}
