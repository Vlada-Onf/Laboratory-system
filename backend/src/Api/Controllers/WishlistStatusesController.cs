using Api.Dtos;
using Api.Modules.Errors;
using Application.WishlistsStatus.Commands.Create;
using Application.WishlistsStatus.Commands.Delete;
using Application.WishlistsStatus.Commands.Update;
using Application.WishlistsStatus.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [ApiController]
    [Route("wishlist-statuses")]
    public class WishlistStatusesController(ISender sender) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<WishlistStatusDto>>> GetAll(
            CancellationToken cancellationToken)
        {
            var statuses = await sender.Send(new GetAllWishlistStatusesQuery(), cancellationToken);

            return statuses
                .Select(WishlistStatusDto.FromDomainModel)
                .ToList();
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<WishlistStatusDto>> GetById(
            [FromRoute] Guid id,
            CancellationToken cancellationToken)
        {
            var result = await sender.Send(new GetWishlistStatusByIdQuery(id), cancellationToken);

            return result.Match<ActionResult<WishlistStatusDto>>(
                s => WishlistStatusDto.FromDomainModel(s),
                () => NotFound());
        }

        [HttpPost]
        public async Task<ActionResult<WishlistStatusDto>> Create(
            [FromBody] CreateWishlistStatusDto request,
            CancellationToken cancellationToken)
        {
            var input = new CreateWishlistStatusCommand
            {
                Name = request.Name,
                Description = request.Description
            };

            var result = await sender.Send(input, cancellationToken);

            return result.Match<ActionResult<WishlistStatusDto>>(
                s => WishlistStatusDto.FromDomainModel(s),
                e => e.ToObjectResult());
        }

        [HttpPut]
        public async Task<ActionResult<WishlistStatusDto>> Update(
            [FromBody] UpdateWishlistStatusDto request,
            CancellationToken cancellationToken)
        {
            var input = new UpdateWishlistStatusCommand
            {
                Id = request.Id,
                Name = request.Name,
                Description = request.Description
            };

            var result = await sender.Send(input, cancellationToken);

            return result.Match<ActionResult<WishlistStatusDto>>(
                s => WishlistStatusDto.FromDomainModel(s),
                e => e.ToObjectResult());
        }

        [HttpDelete("{id:guid}")]
        public async Task<ActionResult> Delete(
            [FromRoute] Guid id,
            CancellationToken cancellationToken)
        {
            var input = new DeleteWishlistStatusCommand(id);

            var result = await sender.Send(input, cancellationToken);

            return result.Match<ActionResult>(
                _ => NoContent(),
                e => e.ToObjectResult());
        }
    }
}
