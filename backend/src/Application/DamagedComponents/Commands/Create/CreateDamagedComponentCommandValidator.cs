using FluentValidation;

namespace Application.DamagedComponents.Commands.Create
{
    public sealed class CreateDamagedComponentCommandValidator
            : AbstractValidator<CreateDamagedComponentCommand>
    {
        public CreateDamagedComponentCommandValidator()
        {
            RuleFor(x => x.ComponentId)
                .NotEmpty().WithMessage("ComponentId є обов'язковим");

            RuleFor(x => x.ReasonId)
                .NotEmpty().WithMessage("ReasonId є обов'язковим");

            RuleFor(x => x.Quantity)
                .GreaterThan(0).WithMessage("Кількість має бути більшою за 0");

            RuleFor(x => x.RecordedBy)
                .NotEmpty().WithMessage("RecordedBy є обов'язковим");
        }
    }
}
