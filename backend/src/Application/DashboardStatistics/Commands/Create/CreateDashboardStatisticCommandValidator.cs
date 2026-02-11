using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DashboardStatistics.Commands.Create
{
    public sealed class CreateDashboardStatisticCommandValidator
        : AbstractValidator<CreateDashboardStatisticCommand>
    {
        public CreateDashboardStatisticCommandValidator()
        {
            RuleFor(x => x.StatisticDate)
                .NotEmpty().WithMessage("Дата статистики є обов'язковою");

            RuleFor(x => x.TotalComponentsCount)
                .GreaterThanOrEqualTo(0).WithMessage("Кількість компонентів не може бути від'ємною");

            RuleFor(x => x.TotalComponentsCost)
                .GreaterThanOrEqualTo(0).WithMessage("Вартість компонентів не може бути від'ємною");

            RuleFor(x => x.TotalDecommissionedCount)
                .GreaterThanOrEqualTo(0).WithMessage("Кількість виведених з експлуатації не може бути від'ємною");
        }
    }
}