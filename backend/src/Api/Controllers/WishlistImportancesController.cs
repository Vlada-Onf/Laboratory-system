using Api.Dtos;
using Api.Modules.Errors;
using Application.WishlistsImportance.Commands.Create;
using Application.WishlistsImportance.Commands.Delete;
using Application.WishlistsImportance.Commands.Update;
using Application.WishlistsImportance.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [ApiController]
    [Route("wishlist-importances")]
    public class WishlistImportancesController(ISender sender) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<WishlistImportanceDto>>> GetAll(
            CancellationToken cancellationToken)
        {
            var importances = await sender.Send(new GetAllWishlistImportancesQuery(), cancellationToken);

            return importances
                .Select(WishlistImportanceDto.FromDomainModel)
                .ToList();
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<WishlistImportanceDto>> GetById(
            [FromRoute] Guid id,
            CancellationToken cancellationToken)
        {
            var result = await sender.Send(new GetWishlistImportanceByIdQuery(id), cancellationToken);

            return result.Match<ActionResult<WishlistImportanceDto>>(
                i => WishlistImportanceDto.FromDomainModel(i),
                () => NotFound());
        }

        [HttpPost]
        public async Task<ActionResult<WishlistImportanceDto>> Create(
            [FromBody] CreateWishlistImportanceDto request,
            CancellationToken cancellationToken)
        {
            var input = new CreateWishlistImportanceCommand
            {
                Name = request.Name,
                Level = request.Level
            };

            var result = await sender.Send(input, cancellationToken);

            return result.Match<ActionResult<WishlistImportanceDto>>(
                i => WishlistImportanceDto.FromDomainModel(i),
                e => e.ToObjectResult());
        }

        [HttpPut]
        public async Task<ActionResult<WishlistImportanceDto>> Update(
            [FromBody] UpdateWishlistImportanceDto request,
            CancellationToken cancellationToken)
        {
            var input = new UpdateWishlistImportanceCommand
            {
                Id = request.Id,
                Name = request.Name,
                Level = request.Level
            };

            var result = await sender.Send(input, cancellationToken);

            return result.Match<ActionResult<WishlistImportanceDto>>(
                i => WishlistImportanceDto.FromDomainModel(i),
                e => e.ToObjectResult());
        }

        [HttpDelete("{id:guid}")]
        public async Task<ActionResult> Delete(
            [FromRoute] Guid id,
            CancellationToken cancellationToken)
        {
            var input = new DeleteWishlistImportanceCommand(id);

            var result = await sender.Send(input, cancellationToken);

            return result.Match<ActionResult>(
                _ => NoContent(),
                e => e.ToObjectResult());
        }
    }
}
