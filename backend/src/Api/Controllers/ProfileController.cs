using Api.Dtos;
using Application.Common.Interfaces;
using Application.Common.Interfaces.Queries;
using Application.Common.Interfaces.Repositories;
using Domain.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[ApiController]
[Route("me")]
[Authorize]
public class ProfileController : ControllerBase
{
    private readonly IUserQueries _userQueries;
    private readonly IUserRepository _userRepository;

    public ProfileController(
        IUserQueries userQueries,
        IUserRepository userRepository)
    {
        _userQueries = userQueries;
        _userRepository = userRepository;
    }

    private async Task<User?> GetCurrentUserAsync(CancellationToken ct)
    {
        var clerkId =
            User.FindFirstValue("sub") ??
            User.FindFirstValue("user_id");

        if (string.IsNullOrWhiteSpace(clerkId))
            return null;

        var option = await _userQueries.GetByClerkIdAsync(clerkId, ct);
        return option.IsSome ? option.First() : null;
    }

    [HttpGet]
    public async Task<ActionResult<UserProfileDto>> GetMyProfile(
        CancellationToken cancellationToken)
    {
        var user = await GetCurrentUserAsync(cancellationToken);
        if (user is null)
            return Unauthorized("User not found");

        return UserProfileDto.FromDomainModel(user);
    }

    [HttpPut]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<UserProfileDto>> UpdateMyProfile(
        [FromForm] UpdateSelfProfileDto request,
        IFormFile? image,
        CancellationToken cancellationToken,
        [FromServices] IFileStorageService fileStorage)
    {
        var user = await GetCurrentUserAsync(cancellationToken);
        if (user is null)
            return Unauthorized("User not found");

        string? photoUrl = user.PhotoUrl;

        if (image is not null && image.Length > 0)
        {
            await using var stream = image.OpenReadStream();
            photoUrl = await fileStorage.UploadAsync(
                stream,
                image.FileName,
                image.ContentType,
                cancellationToken);
        }

        user.UpdateProfile(request.FirstName, request.LastName, photoUrl);

        var updated = await _userRepository.UpdateAsync(user, cancellationToken);

        return UserProfileDto.FromDomainModel(updated);
    }

    [HttpDelete]
    public async Task<ActionResult> DeleteMyAccount(
        CancellationToken cancellationToken)
    {
        var user = await GetCurrentUserAsync(cancellationToken);
        if (user is null)
            return Unauthorized("User not found");

        user.Deactivate();
        await _userRepository.UpdateAsync(user, cancellationToken);

        return NoContent();
    }
    [HttpPost("logout")]
    public async Task<ActionResult> Logout(
    CancellationToken cancellationToken)
    {
        var user = await GetCurrentUserAsync(cancellationToken);
        if (user is null)
            return Unauthorized("User not found");
        user.RecordActivity();
        await _userRepository.UpdateAsync(user, cancellationToken);
        return NoContent();
    }

}
