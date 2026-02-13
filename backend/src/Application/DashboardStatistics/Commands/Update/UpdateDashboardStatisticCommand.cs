using Application.DashboardStatistics.Exceptions;
using Domain.DashboardStatistics;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DashboardStatistics.Commands.Update
{
    public sealed record UpdateDashboardStatisticCommand
        : IRequest<Either<DashboardStatisticException, DashboardStatistic>>
    {
        public required Guid Id { get; init; }
    }
}
