using Application.Common.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("files")]
public sealed class FilesController(IFileStorageService storage) : ControllerBase
{
    [HttpPost("upload")]
    public async Task<ActionResult<string>> Upload(
        IFormFile file,
        CancellationToken cancellationToken)
    {
        if (file is null || file.Length == 0)
            return BadRequest("Файл не завантажено");

        await using var stream = file.OpenReadStream();

        var url = await storage.UploadAsync(
            stream,
            file.FileName,
            file.ContentType,
            cancellationToken);

        return Ok(url);
    }
}
