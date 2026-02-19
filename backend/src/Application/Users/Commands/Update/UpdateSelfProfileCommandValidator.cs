using FluentValidation;

namespace Application.Users.Commands.Update
{
    public class UpdateSelfProfileCommandValidator : AbstractValidator<UpdateSelfProfileCommand>
    {
        public UpdateSelfProfileCommandValidator()
        {
            RuleFor(x => x.Id).NotEmpty();
            RuleFor(x => x.FirstName).NotEmpty().MaximumLength(255);
            RuleFor(x => x.LastName).NotEmpty().MaximumLength(255);
            RuleFor(x => x.PhotoUrl).MaximumLength(500);
        }
    }
}
