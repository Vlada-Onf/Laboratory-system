using Application.DashboardStatistics.Exceptions;
using Domain.DashboardStatistics;
using LanguageExt;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DashboardStatistics.Commands.Create
{
    public sealed record CreateDashboardStatisticCommand
        : IRequest<Either<DashboardStatisticException, DashboardStatistic>>
    {
        public required DateTime StatisticDate { get; init; }
    }

}