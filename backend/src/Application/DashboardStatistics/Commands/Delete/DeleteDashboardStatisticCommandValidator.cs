using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DashboardStatistics.Commands.Delete
{
    public sealed class DeleteDashboardStatisticCommandValidator
        : AbstractValidator<DeleteDashboardStatisticCommand>
    {
        public DeleteDashboardStatisticCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Id є обов'язковим");
        }
    }
}