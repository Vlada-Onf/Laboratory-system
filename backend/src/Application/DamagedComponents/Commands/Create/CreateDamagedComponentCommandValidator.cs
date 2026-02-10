using FluentValidation;

namespace Application.DamagedComponents.Commands.Create
{
    public class CreateDamagedComponentCommandValidator
        : AbstractValidator<CreateDamagedComponentCommand>
    {
        public CreateDamagedComponentCommandValidator()
        {
            RuleFor(x => x.ComponentId).NotEmpty();
            RuleFor(x => x.ReasonId).NotEmpty();
            RuleFor(x => x.Quantity).GreaterThan(0);
            RuleFor(x => x.RecordedBy).NotEmpty();
        }
    }
}
