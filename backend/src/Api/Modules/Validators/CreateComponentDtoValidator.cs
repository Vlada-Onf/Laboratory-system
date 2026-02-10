using Api.Dtos;
using FluentValidation;

namespace Api.Modules.Validators
{
    public class CreateComponentDtoValidator : AbstractValidator<CreateComponentDto>
    {
        public CreateComponentDtoValidator()
        {
            RuleFor(x => x.CategoryId).NotEmpty();
            RuleFor(x => x.Name).NotEmpty().MinimumLength(3).MaximumLength(255);
            RuleFor(x => x.Quantity).GreaterThanOrEqualTo(0);
            RuleFor(x => x.Price).GreaterThanOrEqualTo(0);
            RuleFor(x => x.PhotoUrl).NotEmpty().MaximumLength(500);
            RuleFor(x => x.SupplierLink).NotEmpty().MaximumLength(500);
            RuleFor(x => x.CreatedBy).NotEmpty();
        }
    }

    public class UpdateComponentDtoValidator : AbstractValidator<UpdateComponentDto>
    {
        public UpdateComponentDtoValidator()
        {
            RuleFor(x => x.Id).NotEmpty();
            RuleFor(x => x.CategoryId).NotEmpty();
            RuleFor(x => x.Name).NotEmpty().MinimumLength(3).MaximumLength(255);
            RuleFor(x => x.Quantity).GreaterThanOrEqualTo(0);
            RuleFor(x => x.Price).GreaterThanOrEqualTo(0);
            RuleFor(x => x.PhotoUrl).NotEmpty().MaximumLength(500);
            RuleFor(x => x.SupplierLink).NotEmpty().MaximumLength(500);
            RuleFor(x => x.UpdatedBy).NotEmpty();
        }
    }
}
