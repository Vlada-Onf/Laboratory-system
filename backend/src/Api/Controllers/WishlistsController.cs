using Api.Dtos;
using Api.Modules.Errors;
using Application.Wishlists.Commands.Create;
using Application.Wishlists.Commands.Delete;
using Application.Wishlists.Commands.Update;
using Application.Wishlists.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [ApiController]
    [Route("wishlists")]
    public class WishlistsController(ISender sender) : ControllerBase
    {
        // GET /wishlists/{id}
        [HttpGet("{id:guid}")]
        public async Task<ActionResult<WishlistDto>> GetById(
            [FromRoute] Guid id,
            CancellationToken cancellationToken)
        {
            var result = await sender.Send(new GetWishlistByIdQuery(id), cancellationToken);

            return result.Match<ActionResult<WishlistDto>>(
                w => WishlistDto.FromDomainModel(w),
                () => NotFound());
        }

        // GET /wishlists/by-component/{componentId}
        [HttpGet("by-component/{componentId:guid}")]
        public async Task<ActionResult<IReadOnlyList<WishlistDto>>> GetByComponentId(
            [FromRoute] Guid componentId,
            CancellationToken cancellationToken)
        {
            var wishlists = await sender.Send(
                new GetWishlistsByComponentIdQuery(componentId),
                cancellationToken);

            return wishlists
                .Select(WishlistDto.FromDomainModel)
                .ToList();
        }

        // GET /wishlists/by-user/{userId}
        [HttpGet("by-user/{userId:guid}")]
        public async Task<ActionResult<IReadOnlyList<WishlistDto>>> GetByUser(
            [FromRoute] Guid userId,
            CancellationToken cancellationToken)
        {
            var wishlists = await sender.Send(
                new GetWishlistsByUserQuery(userId),
                cancellationToken);

            return wishlists
                .Select(WishlistDto.FromDomainModel)
                .ToList();
        }

        // POST /wishlists
        [HttpPost]
        public async Task<ActionResult<WishlistDto>> Create(
            [FromBody] CreateWishlistDto request,
            CancellationToken cancellationToken)
        {
            var input = new CreateWishlistCommand
            {
                ComponentId = request.ComponentId,
                Name = request.Name,
                Description = request.Description,
                QuantityNeeded = request.QuantityNeeded,
                RequestedBy = request.RequestedBy,
                ImportanceId = request.ImportanceId,
                StatusId = request.StatusId
            };

            var result = await sender.Send(input, cancellationToken);

            return result.Match<ActionResult<WishlistDto>>(
                w => WishlistDto.FromDomainModel(w),
                e => e.ToObjectResult());
        }

        // PUT /wishlists/details
        [HttpPut("details")]
        public async Task<ActionResult<WishlistDto>> UpdateDetails(
            [FromBody] UpdateWishlistDetailsDto request,
            CancellationToken cancellationToken)
        {
            var input = new UpdateWishlistDetailsCommand
            {
                Id = request.Id,
                Name = request.Name,
                Description = request.Description,
                QuantityNeeded = request.QuantityNeeded,
                ImportanceId = request.ImportanceId
            };

            var result = await sender.Send(input, cancellationToken);

            return result.Match<ActionResult<WishlistDto>>(
                w => WishlistDto.FromDomainModel(w),
                e => e.ToObjectResult());
        }
        // PUT /wishlists/status
        [HttpPut("status")]
        public async Task<ActionResult<WishlistDto>> UpdateStatus(
            [FromBody] ChangeWishlistStatusDto request,
            CancellationToken cancellationToken)
        {
            var input = new UpdateWishlistStatusCommand
            {
                Id = request.Id,
                StatusId = request.StatusId,
                CompletionReason = request.CompletionReason
            };

            var result = await sender.Send(input, cancellationToken);

            return result.Match<ActionResult<WishlistDto>>(
                w => WishlistDto.FromDomainModel(w),
                e => e.ToObjectResult());
        }
        // DELETE /wishlists/{id}
        [HttpDelete("{id:guid}")]
        public async Task<ActionResult> Delete(
            [FromRoute] Guid id,
            CancellationToken cancellationToken)
        {
            var input = new DeleteWishlistCommand(id);

            var result = await sender.Send(input, cancellationToken);

            return result.Match<ActionResult>(
                _ => NoContent(),
                e => e.ToObjectResult());
        }
    }
}
