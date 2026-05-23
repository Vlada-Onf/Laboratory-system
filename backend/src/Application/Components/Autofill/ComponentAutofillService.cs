using System.Text.Json;
using Application.Common.Interfaces;

namespace Application.Components.Autofill;

public class ComponentAutofillService : IComponentAutofillService
{
    private readonly IGroqService _groqService;

    public ComponentAutofillService(IGroqService groqService)
    {
        _groqService = groqService;
    }

    public async Task<ComponentAutofillResult> SuggestAsync(
        ComponentAutofillInput input,
        CancellationToken cancellationToken)
    {
        var payload = new
        {
            name = input.Name,
            supplierLink = input.SupplierLink,
            existingDescription = input.ExistingDescription,
            categories = input.Categories,
            tags = input.Tags
        };

        var json = JsonSerializer.Serialize(payload, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        var aiJson = await _groqService.SuggestComponentAutofillAsync(json, cancellationToken);

        var parsed = JsonSerializer.Deserialize<ComponentAutofillResult>(
            aiJson,
            new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

        return parsed ?? new ComponentAutofillResult(null, string.Empty, [], 0);
    }
}