using Api.Dtos;
using Api.Modules.Errors;
using Application.Common.Interfaces;
using Application.Components.Commands.ImportAiComponents;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace Api.Controllers
{
    [ApiController]
    [Route("import")]
    [AllowAnonymous]
    public class ImportController : ControllerBase
    {
        private readonly IGroqService _groqService;
        private readonly ISender _sender;

        public ImportController(IGroqService groqService, ISender sender)
        {
            _groqService = groqService;
            _sender = sender;
        }

        [HttpPost("analyze-image")]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult<IReadOnlyList<InventoryItemImportDto>>> AnalyzeImage(
            IFormFile image,
            CancellationToken cancellationToken)
        {
            if (image is null || image.Length == 0)
                return BadRequest("Файл не обрано або порожній.");

            var allowedTypes = new[] { "image/jpeg", "image/png", "image/webp", "image/heic" };
            if (!allowedTypes.Contains(image.ContentType))
                return BadRequest("Непідтримуваний тип файлу: " + image.ContentType);

            using var ms = new MemoryStream();
            await image.CopyToAsync(ms, cancellationToken);

            var raw = await _groqService.AnalyzeInventoryImageAsync(
                ms.ToArray(), image.ContentType, cancellationToken);

            List<InventoryItemImportDto>? items;
            try
            {
                var json = ExtractJson(raw);
                items = JsonSerializer.Deserialize<List<InventoryItemImportDto>>(
                    json,
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            }
            catch (JsonException ex)
            {
                return BadRequest("Не вдалося розпарсити JSON від AI: " + ex.Message);
            }

            if (items is null)
                return BadRequest("AI повернув порожній або некоректний JSON.");

            return Ok(NormalizeItems(items));
        }

        [HttpPost("import-items")]
        public async Task<ActionResult<IReadOnlyList<ComponentImportResultDto>>> ImportItems(
            [FromBody] ImportAiComponentsRequest request,
            CancellationToken cancellationToken)
        {
            var command = new ImportAiComponentsCommand
            {
                CategoryId = request.CategoryId,
                CreatedBy = request.CreatedBy,
                PerformedBy = request.CreatedBy,
                Items = request.Items.Select(x => new ImportAiItemData
                {
                    Name = BuildNormalizedName(x),
                    Model = x.MappingStrategy == NameMappingStrategy.Separate ? Clean(x.Model) : string.Empty,
                    InventoryNumber = Clean(x.InventoryNumber),
                    SerialNumber = Clean(x.SerialNumber),
                    State = Clean(x.State),
                    Location = Clean(x.Location),
                    Notes = Clean(x.Notes)
                }).ToList()
            };

            var result = await _sender.Send(command, cancellationToken);

            return result.Match<ActionResult<IReadOnlyList<ComponentImportResultDto>>>(
                Right: components => Ok(components
                    .Select(c => new ComponentImportResultDto(c.Id.Value, c.Name))
                    .ToList()),
                Left: e => e.ToObjectResult());
        }

        private static string BuildNormalizedName(InventoryItemImportDto x)
        {
            var name = Clean(x.Name);
            var model = Clean(x.Model);

            return x.MappingStrategy switch
            {
                NameMappingStrategy.MergeIntoName => JoinNonEmpty(name, model),
                NameMappingStrategy.SingleField => !string.IsNullOrWhiteSpace(name) ? name : model,
                _ => name
            };
        }

        private static string JoinNonEmpty(params string[] values)
            => string.Join(" ", values.Where(v => !string.IsNullOrWhiteSpace(v)));

        private static string ExtractJson(string raw)
        {
            var text = raw.Trim();
            if (!text.StartsWith("```")) return text;
            var firstNewLine = text.IndexOf('\n');
            if (firstNewLine >= 0) text = text[(firstNewLine + 1)..];
            var lastFence = text.LastIndexOf("```");
            if (lastFence >= 0) text = text[..lastFence];
            return text.Trim();
        }

        private static List<InventoryItemImportDto> NormalizeItems(List<InventoryItemImportDto> items)
            => items.Select(x => new InventoryItemImportDto
            {
                Name = Clean(x.Name),
                Model = Clean(x.Model),
                InventoryNumber = Clean(x.InventoryNumber),
                SerialNumber = Clean(x.SerialNumber),
                State = Clean(x.State),
                Location = Clean(x.Location),
                Notes = Clean(x.Notes),
                MappingStrategy = x.MappingStrategy
            }).ToList();

        private static string Clean(string? value)
        {
            if (string.IsNullOrWhiteSpace(value)) return string.Empty;
            var s = value.Replace("\r\n", " ").Replace("\n", " ").Replace("\r", " ").Trim();
            return Regex.Replace(s, @"\s+", " ");
        }
    }
}