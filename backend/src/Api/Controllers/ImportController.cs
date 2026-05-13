using Application.Common.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize]
public class ImportController : ControllerBase
{
    private readonly IGeminiService _geminiService;

    public ImportController(IGeminiService geminiService)
    {
        _geminiService = geminiService;
    }

    [HttpPost("analyze-image")]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<string>> AnalyzeImage(
        IFormFile file,
        CancellationToken cancellationToken)
    {
        if (file is null || file.Length == 0)
            return BadRequest("Файл не обрано або порожній.");

        var allowedTypes = new[] { "image/jpeg", "image/png", "image/webp", "image/heic" };
        if (!allowedTypes.Contains(file.ContentType))
            return BadRequest($"Непідтримуваний тип файлу: {file.ContentType}");

        using var ms = new MemoryStream();
        await file.CopyToAsync(ms, cancellationToken);

        var result = await _geminiService.AnalyzeInventoryImageAsync(
            ms.ToArray(),
            file.ContentType,
            cancellationToken);

        return Ok(result);
    }
}