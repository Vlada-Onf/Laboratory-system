using FluentValidation;

namespace Application.Components.Commands.ImportAiComponents
{
    public class ImportAiComponentsCommandValidator : AbstractValidator<ImportAiComponentsCommand>
    {
        public ImportAiComponentsCommandValidator()
        {
            RuleFor(x => x.CategoryId)
                .NotEmpty()
                .WithMessage("CategoryId є обов'язковим");

            RuleFor(x => x.CreatedBy)
                .NotEmpty()
                .WithMessage("CreatedBy є обов'язковим");

            RuleFor(x => x.Items)
                .NotEmpty()
                .WithMessage("Список елементів не може бути порожнім");

            RuleForEach(x => x.Items).ChildRules(item =>
            {
                item.RuleFor(x => x.Name)
                    .NotEmpty()
                    .WithMessage("Назва компонента є обов'язковою")
                    .MaximumLength(255);

                item.RuleFor(x => x.InventoryNumber).MaximumLength(255);
                item.RuleFor(x => x.SerialNumber).MaximumLength(255);
                item.RuleFor(x => x.State).MaximumLength(255);
                item.RuleFor(x => x.Location).MaximumLength(255);
            });
        }
    }
}