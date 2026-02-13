using FluentValidation;

namespace Application.DashboardStatistics.Commands.Create
{
    public sealed class CreateDashboardStatisticCommandValidator
        : AbstractValidator<CreateDashboardStatisticCommand>
    {
        public CreateDashboardStatisticCommandValidator()
        {
            RuleFor(x => x.StatisticDate)
                .NotEmpty()
                .WithMessage("Дата статистики є обов'язковою");
        }
    }
}
