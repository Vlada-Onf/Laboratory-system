using Api.Dtos;
using Api.Modules.Errors;
using Application.DashboardStatistics.Commands.Create;
using Application.DashboardStatistics.Commands.Delete;
using Application.DashboardStatistics.Commands.Update;
using Application.DashboardStatistics.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [ApiController]
    [Route("dashboard-statistics")]
    [Authorize]
    public class DashboardStatisticsController(ISender sender) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<DashboardStatisticDto>>> GetAll(
            CancellationToken cancellationToken)
        {
            var stats = await sender.Send(new GetAllDashboardStatisticsQuery(), cancellationToken);

            return stats
                .Select(DashboardStatisticDto.FromDomainModel)
                .ToList();
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<DashboardStatisticDto>> GetById(
            [FromRoute] Guid id,
            CancellationToken cancellationToken)
        {
            var result = await sender.Send(new GetDashboardStatisticByIdQuery(id), cancellationToken);

            return result.Match<ActionResult<DashboardStatisticDto>>(
                s => DashboardStatisticDto.FromDomainModel(s),
                () => NotFound());
        }

        [HttpGet("by-date")]
        public async Task<ActionResult<DashboardStatisticDto>> GetByDate(
            [FromQuery] DateTime date,
            CancellationToken cancellationToken)
        {
            var result = await sender.Send(new GetDashboardStatisticByDateQuery(date), cancellationToken);

            return result.Match<ActionResult<DashboardStatisticDto>>(
                s => DashboardStatisticDto.FromDomainModel(s),
                () => NotFound());
        }

        [HttpGet("latest")]
        public async Task<ActionResult<DashboardStatisticDto>> GetLatest(
            CancellationToken cancellationToken)
        {
            var result = await sender.Send(new GetLatestDashboardStatisticQuery(), cancellationToken);

            return result.Match<ActionResult<DashboardStatisticDto>>(
                s => DashboardStatisticDto.FromDomainModel(s),
                () => NotFound());
        }

        [HttpPost]
        public async Task<ActionResult<DashboardStatisticDto>> Create(
            [FromBody] CreateDashboardStatisticDto request,
            CancellationToken cancellationToken)
        {
            var input = new CreateDashboardStatisticCommand
            {
                StatisticDate = request.StatisticDate
            };

            var result = await sender.Send(input, cancellationToken);

            return result.Match<ActionResult<DashboardStatisticDto>>(
                s => DashboardStatisticDto.FromDomainModel(s),
                e => e.ToObjectResult());
        }


        [HttpPut]
        public async Task<ActionResult<DashboardStatisticDto>> Update(
     [FromBody] UpdateDashboardStatisticDto request,
     CancellationToken cancellationToken)
        {
            var input = new UpdateDashboardStatisticCommand
            {
                Id = request.Id
            };

            var result = await sender.Send(input, cancellationToken);

            return result.Match<ActionResult<DashboardStatisticDto>>(
                s => DashboardStatisticDto.FromDomainModel(s),
                e => e.ToObjectResult());
        }


        [HttpDelete("{id:guid}")]
        public async Task<ActionResult> Delete(
            [FromRoute] Guid id,
            CancellationToken cancellationToken)
        {
            var input = new DeleteDashboardStatisticCommand(id);

            var result = await sender.Send(input, cancellationToken);

            return result.Match<ActionResult>(
                _ => NoContent(),
                e => e.ToObjectResult());
        }
    }
}
