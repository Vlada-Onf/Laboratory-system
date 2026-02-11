using Api.Dtos;
using FluentValidation;

namespace Api.Modules.Validators
{
    public class CreateTagDtoValidator : AbstractValidator<CreateTagDto>
    {
        public CreateTagDtoValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty()
                .MinimumLength(2)
                .MaximumLength(100);

            RuleFor(x => x.Color)
                .NotEmpty()
                .MaximumLength(50);

            RuleFor(x => x.CreatedBy)
                .NotEmpty();
        }
    }
    public class UpdateTagDtoValidator : AbstractValidator<UpdateTagDto>
    {
        public UpdateTagDtoValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty();

            RuleFor(x => x.Name)
                .NotEmpty()
                .MinimumLength(2)
                .MaximumLength(100);

            RuleFor(x => x.Color)
                .NotEmpty()
                .MaximumLength(50);
        }
    }
}
