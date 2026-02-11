using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DashboardStatistics.Commands.Update
{
    public sealed class UpdateDashboardStatisticCommandValidator
        : AbstractValidator<UpdateDashboardStatisticCommand>
    {
        public UpdateDashboardStatisticCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id є обов'язковим");

            RuleFor(x => x.TotalComponentsCount)
                .GreaterThanOrEqualTo(0);

            RuleFor(x => x.TotalComponentsCost)
                .GreaterThanOrEqualTo(0);

            RuleFor(x => x.TotalDecommissionedCount)
                .GreaterThanOrEqualTo(0);
        }
    }
}
