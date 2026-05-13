using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Application.Common.Interfaces;
using Microsoft.Extensions.Options;

namespace Infrastructure.AI;

public sealed class GeminiService : IGeminiService
{
    private readonly HttpClient _httpClient;
    private readonly GeminiOptions _options;

    public GeminiService(HttpClient httpClient, IOptions<GeminiOptions> options)
    {
        _httpClient = httpClient;
        _options = options.Value;
    }

    public async Task<string> AnalyzeInventoryImageAsync(
        byte[] fileBytes,
        string contentType,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(_options.ApiKey))
            throw new InvalidOperationException("Gemini API key is missing.");

        var prompt =
            "Проаналізуй це фото лабораторної таблиці або журналу обліку техніки. " +
            "Поверни виключно валідний JSON-масив без markdown і без пояснень. " +
            "Для кожного елемента використовуй поля: " +
            "name, model, inventoryNumber, serialNumber, state, location, notes. " +
            "Якщо значення відсутнє або не читається — поверни порожній рядок. " +
            "Не вигадуй значення.";

        var requestBody = new
        {
            contents = new object[]
            {
                new
                {
                    parts = new object[]
                    {
                        new { text = prompt },
                        new
                        {
                            inlineData = new
                            {
                                mimeType = string.IsNullOrWhiteSpace(contentType) ? "image/jpeg" : contentType,
                                data = Convert.ToBase64String(fileBytes)
                            }
                        }
                    }
                }
            }
        };

        var json = JsonSerializer.Serialize(requestBody);

        using var request = new HttpRequestMessage(
            HttpMethod.Post,
            $"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={_options.ApiKey}");

        request.Content = new StringContent(json, Encoding.UTF8, "application/json");
        request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

        using var response = await _httpClient.SendAsync(request, cancellationToken);
        var responseContent = await response.Content.ReadAsStringAsync(cancellationToken);

        if (!response.IsSuccessStatusCode)
            throw new InvalidOperationException(
                $"Gemini API error: {response.StatusCode}. {responseContent}");

        using var document = JsonDocument.Parse(responseContent);

        if (!document.RootElement.TryGetProperty("candidates", out var candidates)
            || candidates.GetArrayLength() == 0)
            throw new InvalidOperationException(
                $"Gemini returned no candidates. Raw response: {responseContent}");

        var content = candidates[0];

        if (!content.TryGetProperty("content", out var contentProp)
            || !contentProp.TryGetProperty("parts", out var parts))
            throw new InvalidOperationException(
                $"Gemini response missing content/parts. Raw response: {responseContent}");

        foreach (var part in parts.EnumerateArray())
        {
            if (part.TryGetProperty("text", out var textEl))
                return textEl.GetString() ?? "[]";
        }

        throw new InvalidOperationException(
            $"Gemini returned no text part. Raw response: {responseContent}");
    }
}