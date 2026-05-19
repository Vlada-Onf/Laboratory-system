namespace Application.Common.Interfaces;

public interface IExcelService
{
    Task<string> AnalyzeInventoryExcelAsync(
        byte[] fileBytes,
        string fileName,
        CancellationToken cancellationToken);
}