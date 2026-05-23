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

        var mimeType = string.IsNullOrWhiteSpace(contentType) ? "image/jpeg" : contentType;
        var base64Image = Convert.ToBase64String(fileBytes);
        var imageUrl = $"data:{mimeType};base64,{base64Image}";

        var prompt =
            "Проаналізуй це фото лабораторної таблиці або журналу обліку техніки. " +
            "Поверни виключно валідний JSON-масив без markdown і без пояснень. " +
            "Починай відповідь одразу з символу [ і завершуй символом ]. " +
            "Для кожного елемента використовуй тільки поля: " +
            "name, model, inventoryNumber, serialNumber, state, location, notes, mappingStrategy. " +
            "Не додавай жодних інших полів. " +
            "mappingStrategy може бути тільки одним із значень: Separate, MergeIntoName, SingleField. " +
            "Якщо name і model окремі, але разом вони формують одну назву предмета, використай MergeIntoName. " +
            "Якщо є лише один змістовний стовпець для назви, використай SingleField. " +
            "Якщо name і model мають зберігатися окремо, використай Separate. " +
            "Якщо значення відсутнє або не читається — поверни порожній рядок. " +
            "Не вигадуй значення. " +
            "Поверни всі текстові значення тільки українською мовою. " +
            "Кожне значення повертай в один рядок без переносів.";

        var requestBody = new
        {
            model = _options.Model,
            messages = new object[]
            {
                new { role = "system", content = "You are an OCR data extraction service. Return only valid JSON array." },
                new
                {
                    role = "user",
                    content = new object[]
                    {
                        new { type = "text", text = prompt },
                        new { type = "image_url", image_url = new { url = imageUrl } }
                    }
                }
            },
            temperature = 0.1
        };

        return await SendGroqRequestAsync(requestBody, cancellationToken);
    }

    public async Task<string> AnalyzeInventoryExcelTextAsync(
        string excelJsonStructure,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(_options.ApiKey))
            throw new InvalidOperationException("Groq API key is missing.");

        var prompt =
            "Проаналізуй структуру та дані Excel таблиці, які надані у форматі JSON. " +
            "Твоє завдання — розпарсити ці дані та змапити їх на стандартний список інвентарю. " +
            "Поверни виключно валідний JSON-масив без markdown-розмітки і без жодних пояснень. " +
            "Починай відповідь одразу з символу [ і завершуй символом ]. " +
            "Для кожного елемента використовуй тільки поля: " +
            "name, model, inventoryNumber, serialNumber, state, location, notes, mappingStrategy. " +
            "Не додавай жодних інших полів. " +
            "mappingStrategy може бути тільки одним із значень: Separate, MergeIntoName, SingleField. " +
            "Орієнтуйся на назви колонок (headers) та значення. Якщо назва і модель рознесені, використовуй Separate або MergeIntoName за логікою. " +
            "Поверни всі текстові значення тільки українською мовою. " +
            "Не додавай англійський переклад. Кожне значення повертай в один рядок без переносів. " +
            "Ось дані для аналізу:\n\n" + excelJsonStructure;

        var requestBody = new
        {
            model = _options.Model,
            messages = new object[]
            {
                new { role = "system", content = "You are an expert data migration service. Convert the provided Excel JSON structure into a clean, standardized inventory JSON array." },
                new { role = "user", content = prompt }
            },
            temperature = 0.1
        };

        return await SendGroqRequestAsync(requestBody, cancellationToken);
    }

    public async Task<string> AnalyzeLowStockRiskAsync(
        string inventoryAnalysisJson,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(_options.ApiKey))
            throw new InvalidOperationException("Groq API key is missing.");

        var prompt =
            "Проаналізуй JSON з компонентами складу та їхніми метриками використання. " +
            "Визнач, які компоненти можуть скоро закінчитися. " +
            "Поверни виключно валідний JSON-масив без markdown і без пояснень. " +
            "Починай відповідь одразу з символу [ і завершуй символом ]. " +
            "Для кожного елемента використовуй тільки поля: " +
            "componentId, name, currentQuantity, riskLevel, estimatedDaysLeft, reason, recommendedAction. " +
            "currentQuantity має відповідати вхідному currentQuantity. " +
            "riskLevel може бути тільки одним із значень: high, medium, low. " +
            "estimatedDaysLeft має бути числом. " +
            "reason і recommendedAction повертай українською мовою. " +
            "Не додавай жодних інших полів. " +
            "Орієнтуйся на currentQuantity, averageDailyUsage, consumptionEventsCount, daysSinceLastConsumption, estimatedDaysLeft. " +
            "Критичними вважай насамперед компоненти з малим estimatedDaysLeft або нестабільним, але частим споживанням. " +
            "Не позначай компоненти як high risk, якщо запас великий і estimatedDaysLeft явно великий. " +
            "Ось дані для аналізу:\n\n" + inventoryAnalysisJson;

        var requestBody = new
        {
            model = _options.Model,
            messages = new object[]
            {
                new
                {
                    role = "system",
                    content = "You are an inventory risk analysis service. Return only valid JSON array."
                },
                new
                {
                    role = "user",
                    content = prompt
                }
            },
            temperature = 0.1
        };

        return await SendGroqRequestAsync(requestBody, cancellationToken);
    }

    private async Task<string> SendGroqRequestAsync(object requestBody, CancellationToken cancellationToken)
    {
        var json = JsonSerializer.Serialize(requestBody, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        using var request = new HttpRequestMessage(HttpMethod.Post, "v1/chat/completions");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _options.ApiKey);
        request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        request.Content = new StringContent(json, Encoding.UTF8, "application/json");

        using var response = await _httpClient.SendAsync(request, cancellationToken);
        var responseContent = await response.Content.ReadAsStringAsync(cancellationToken);

        if (!response.IsSuccessStatusCode)
            throw new InvalidOperationException($"Groq API error: {response.StatusCode}. {responseContent}");

        using var document = JsonDocument.Parse(responseContent);

        if (!document.RootElement.TryGetProperty("choices", out var choices) || choices.GetArrayLength() == 0)
            throw new InvalidOperationException($"Groq returned no choices. Raw response: {responseContent}");

        var firstChoice = choices[0];
        if (!firstChoice.TryGetProperty("message", out var message) || !message.TryGetProperty("content", out var content))
            throw new InvalidOperationException($"Groq response missing message/content. Raw response: {responseContent}");

        return content.GetString() ?? "[]";
    }
    public async Task<string> SuggestComponentAutofillAsync(
        string componentAutofillJson,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(_options.ApiKey))
            throw new InvalidOperationException("Groq API key is missing.");

        var prompt =
            "Проаналізуй дані для створення нового компонента в інвентарній системі. " +
            "Поверни виключно валідний JSON-об'єкт без markdown і без пояснень. " +
            "Починай відповідь одразу з символу { і завершуй символом }. " +
            "Для відповіді використовуй тільки поля: " +
            "suggestedCategoryId, description, tagIds, confidence. " +
            "suggestedCategoryId має бути GUID існуючої категорії або null. " +
            "description має бути коротким, змістовним описом українською мовою. " +
            "tagIds має бути масивом GUID існуючих тегів або порожнім масивом. " +
            "confidence має бути числом від 0 до 1. " +
            "Не вигадуй нові категорії чи теги. Обирай лише з тих, що є у вхідних даних. " +
            "Ось дані для аналізу:\n\n" + componentAutofillJson;

        var requestBody = new
        {
            model = _options.Model,
            messages = new object[]
            {
                new
                {
                    role = "system",
                    content = "You are an assistant that suggests autofill values for inventory component creation. Return only valid JSON object."
                },
                new
                {
                    role = "user",
                    content = prompt
                }
            },
            temperature = 0.1
        };

        return await SendGroqRequestAsync(requestBody, cancellationToken);
    }
}