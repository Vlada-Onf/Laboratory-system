using FluentValidation;

namespace Application.Comment.Commands.Create
{
    public sealed class CreateComponentCommentCommandValidator
        : AbstractValidator<CreateComponentCommentCommand>
    {
        public CreateComponentCommentCommandValidator()
        {
            RuleFor(x => x.ComponentId)
                .NotEmpty().WithMessage("ComponentId є обов'язковим");

            RuleFor(x => x.Content)
                .NotEmpty().WithMessage("Коментар не може бути порожнім")
                .MaximumLength(2000).WithMessage("Коментар не може бути довшим за 2000 символів");

            RuleFor(x => x.CreatedBy)
                .NotEmpty().WithMessage("CreatedBy є обов'язковим");

            RuleFor(x => x.PerformedBy)
                .NotEmpty().WithMessage("PerformedBy є обов'язковим");
        }
    }
}
