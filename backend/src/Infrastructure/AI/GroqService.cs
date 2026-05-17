using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Application.Common.Interfaces;
using Microsoft.Extensions.Options;

namespace Infrastructure.AI;

public sealed class GroqService : IGroqService
{
    private readonly HttpClient _httpClient;
    private readonly GroqOptions _options;

    public GroqService(HttpClient httpClient, IOptions<GroqOptions> options)
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
            throw new InvalidOperationException("Groq API key is missing.");

        var mimeType = string.IsNullOrWhiteSpace(contentType)
            ? "image/jpeg"
            : contentType;

        var base64Image = Convert.ToBase64String(fileBytes);
        var imageUrl = $"data:{mimeType};base64,{base64Image}";

        var prompt =
            "Проаналізуй це фото лабораторної таблиці або журналу обліку техніки. " +
            "Поверни виключно валідний JSON-масив без markdown і без пояснень. " +
            "Починай відповідь одразу з символу [ і завершуй символом ]. " +
            "Для кожного елемента використовуй тільки поля: " +
            "name, model, inventoryNumber, serialNumber, state, location, notes. " +
            "Не додавай жодних інших полів. " +
            "Якщо значення відсутнє або не читається — поверни порожній рядок. " +
            "Не вигадуй значення. " +
            "Поверни всі текстові значення тільки українською мовою. " +
            "Не додавай англійський переклад. " +
            "Кожне значення повертай в один рядок без переносів.";

        var requestBody = new
        {
            model = _options.Model,
            messages = new object[]
            {
                new
                {
                    role = "system",
                    content = "You are an OCR data extraction service. Return only valid JSON array."
                },
                new
                {
                    role = "user",
                    content = new object[]
                    {
                        new
                        {
                            type = "text",
                            text = prompt
                        },
                        new
                        {
                            type = "image_url",
                            image_url = new
                            {
                                url = imageUrl
                            }
                        }
                    }
                }
            },
            temperature = 0.1
        };

        var json = JsonSerializer.Serialize(requestBody);

        using var request = new HttpRequestMessage(
            HttpMethod.Post,
            "https://api.groq.com/openai/v1/chat/completions");

        request.Headers.Authorization =
            new AuthenticationHeaderValue("Bearer", _options.ApiKey);

        request.Headers.Accept.Add(
            new MediaTypeWithQualityHeaderValue("application/json"));

        request.Content = new StringContent(json, Encoding.UTF8, "application/json");

        using var response = await _httpClient.SendAsync(request, cancellationToken);
        var responseContent = await response.Content.ReadAsStringAsync(cancellationToken);

        if (!response.IsSuccessStatusCode)
            throw new InvalidOperationException(
                $"Groq API error: {response.StatusCode}. {responseContent}");

        using var document = JsonDocument.Parse(responseContent);

        if (!document.RootElement.TryGetProperty("choices", out var choices)
            || choices.GetArrayLength() == 0)
            throw new InvalidOperationException(
                $"Groq returned no choices. Raw response: {responseContent}");

        var firstChoice = choices[0];

        if (!firstChoice.TryGetProperty("message", out var message)
            || !message.TryGetProperty("content", out var content))
            throw new InvalidOperationException(
                $"Groq response missing message/content. Raw response: {responseContent}");

        return content.GetString() ?? "[]";
    }
}