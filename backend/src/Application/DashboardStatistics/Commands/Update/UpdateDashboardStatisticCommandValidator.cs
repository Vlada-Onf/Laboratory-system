using FluentValidation;

namespace Application.DashboardStatistics.Commands.Update
{
    public sealed class UpdateDashboardStatisticCommandValidator
        : AbstractValidator<UpdateDashboardStatisticCommand>
    {
        public UpdateDashboardStatisticCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty()
                .WithMessage("Id є обов'язковим");
        }
    }
}
