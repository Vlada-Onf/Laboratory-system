using Api.Dtos;
using FluentValidation;

namespace Api.Modules.Validators
{
    public class CreateDamagedComponentDtoValidator : AbstractValidator<CreateDamagedComponentDto>
    {
        public CreateDamagedComponentDtoValidator()
        {
            RuleFor(x => x.ComponentId)
                .NotEmpty();

            RuleFor(x => x.ReasonId)
                .NotEmpty();

            RuleFor(x => x.Quantity)
                .GreaterThan(0);

            RuleFor(x => x.RecordedBy)
                .NotEmpty();
        }
    }

    public class UpdateDamagedComponentDtoValidator : AbstractValidator<UpdateDamagedComponentDto>
    {
        public UpdateDamagedComponentDtoValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty();

            RuleFor(x => x.ComponentId)
                .NotEmpty();

            RuleFor(x => x.ReasonId)
                .NotEmpty();

            RuleFor(x => x.Quantity)
                .GreaterThan(0);

            RuleFor(x => x.UpdatedBy)
                .NotEmpty();
        }
    }
}
