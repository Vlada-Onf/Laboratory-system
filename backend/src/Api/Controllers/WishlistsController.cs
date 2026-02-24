using Api.Dtos;
using Api.Modules.Errors;
using Application.Wishlists.Commands.Create;
using Application.Wishlists.Commands.Delete;
using Application.Wishlists.Commands.Update;
using Application.Wishlists.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [ApiController]
    [Route("wishlists")]
    [AllowAnonymous]
    public class WishlistsController(ISender sender) : ControllerBase
    {
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

        [HttpPost]
        public async Task<ActionResult<WishlistDto>> Create(
         [FromBody] CreateWishlistDto request,
         CancellationToken cancellationToken)
        {
            var input = new CreateWishlistCommand
            {
                Name = request.Name,
                Description = request.Description,
                QuantityNeeded = request.QuantityNeeded,
                RequestedBy = request.RequestedBy,
                ImportanceId = request.ImportanceId,
                StatusId = request.StatusId,
                PerformedBy = request.PerformedBy
            };

            var result = await sender.Send(input, cancellationToken);

            return result.Match<ActionResult<WishlistDto>>(
                w => WishlistDto.FromDomainModel(w),
                e => e.ToObjectResult());
        }

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
                ImportanceId = request.ImportanceId,
                PerformedBy = request.PerformedBy
            };

            var result = await sender.Send(input, cancellationToken);

            return result.Match<ActionResult<WishlistDto>>(
                w => WishlistDto.FromDomainModel(w),
                e => e.ToObjectResult());
        }

        [HttpPut("status")]
        public async Task<ActionResult<WishlistDto>> UpdateStatus(
            [FromBody] ChangeWishlistStatusDto request,
            [FromQuery] Guid performedBy,
            CancellationToken cancellationToken)
        {
            var input = new UpdateWishlistStatusCommand
            {
                Id = request.Id,
                StatusId = request.StatusId,
                CompletionReason = request.CompletionReason,
                PerformedBy = performedBy
            };

            var result = await sender.Send(input, cancellationToken);

            return result.Match<ActionResult<WishlistDto>>(
                w => WishlistDto.FromDomainModel(w),
                e => e.ToObjectResult());
        }

        [HttpDelete("{id:guid}")]
        public async Task<ActionResult> Delete(
            [FromRoute] Guid id,
            [FromQuery] Guid performedBy,
            CancellationToken cancellationToken)
        {
            var input = new DeleteWishlistCommand(id, performedBy);

            var result = await sender.Send(input, cancellationToken);

            return result.Match<ActionResult>(
                _ => NoContent(),
                e => e.ToObjectResult());
        }

        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<WishlistDto>>> GetAll(
            CancellationToken cancellationToken)
        {
            var wishlists = await sender.Send(new GetAllWishlistsQuery(), cancellationToken);

            return wishlists
                .Select(WishlistDto.FromDomainModel)
                .ToList();
        }
    }
}
