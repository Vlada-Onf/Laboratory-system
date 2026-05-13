namespace Application.Common.Interfaces;

public interface IGeminiService
{
    Task<string> AnalyzeInventoryImageAsync(
        byte[] fileBytes,
        string contentType,
        CancellationToken cancellationToken);
}