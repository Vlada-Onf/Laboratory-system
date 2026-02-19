using FluentValidation;

namespace Application.Users.Commands.Update
{
    public class UpdateUserByAdminCommandValidator : AbstractValidator<UpdateUserByAdminCommand>
    {
        public UpdateUserByAdminCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty();

            RuleFor(x => x.FirstName)
                .MaximumLength(255);

            RuleFor(x => x.LastName)
                .MaximumLength(255);

            RuleFor(x => x.PerformedBy)
                .NotEmpty();
        }
    }
}
