namespace Infrastructure.AI;

public class GroqOptions
{
    public const string SectionName = "Groq";
    public string ApiKey { get; init; } = string.Empty;
    public string Model { get; init; } = "meta-llama/llama-4-scout-17b-16e-instruct";
}