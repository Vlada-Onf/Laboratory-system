namespace Application.Common.Interfaces;

public interface IGroqService
{
    Task<string> AnalyzeInventoryImageAsync(
        byte[] fileBytes,
        string contentType,
        CancellationToken cancellationToken);
}