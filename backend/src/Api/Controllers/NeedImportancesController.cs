using Api.Dtos;
using Api.Modules.Errors;
using Application.NeedsImportance.Commands.Create;
using Application.NeedsImportance.Commands.Delete;
using Application.NeedsImportance.Commands.Update;
using Application.NeedsImportance.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [ApiController]
    [Route("need-importances")]
    public class NeedImportancesController(ISender sender) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<NeedImportanceDto>>> GetAll(
            CancellationToken cancellationToken)
        {
            var importances = await sender.Send(new GetAllNeedImportancesQuery(), cancellationToken);

            return importances
                .Select(NeedImportanceDto.FromDomainModel)
                .ToList();
        }

        [HttpGet("by-level/{level:int}")]
        public async Task<ActionResult<NeedImportanceDto>> GetByLevel(
            [FromRoute] int level,
            CancellationToken cancellationToken)
        {
            var result = await sender.Send(new GetNeedImportanceByLevelQuery(level), cancellationToken);

            return result.Match<ActionResult<NeedImportanceDto>>(
                i => NeedImportanceDto.FromDomainModel(i),
                () => NotFound());
        }

        [HttpPost]
        public async Task<ActionResult<NeedImportanceDto>> Create(
            [FromBody] CreateNeedImportanceDto request,
            CancellationToken cancellationToken)
        {
            var input = new CreateNeedImportanceCommand
            {
                Name = request.Name,
                Level = request.Level
            };

            var result = await sender.Send(input, cancellationToken);

            return result.Match<ActionResult<NeedImportanceDto>>(
                i => NeedImportanceDto.FromDomainModel(i),
                e => e.ToObjectResult());
        }

        [HttpPut]
        public async Task<ActionResult<NeedImportanceDto>> Update(
            [FromBody] UpdateNeedImportanceFullDto request,
            CancellationToken cancellationToken)
        {
            var input = new UpdateNeedImportanceCommand
            {
                Id = request.Id,
                Name = request.Name,
                Level = request.Level
            };

            var result = await sender.Send(input, cancellationToken);

            return result.Match<ActionResult<NeedImportanceDto>>(
                i => NeedImportanceDto.FromDomainModel(i),
                e => e.ToObjectResult());
        }

        [HttpDelete("{id:guid}")]
        public async Task<ActionResult> Delete(
            [FromRoute] Guid id,
            CancellationToken cancellationToken)
        {
            var input = new DeleteNeedImportanceCommand(id);

            var result = await sender.Send(input, cancellationToken);

            return result.Match<ActionResult>(
                _ => NoContent(),
                e => e.ToObjectResult());
        }
    }
}
