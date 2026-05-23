namespace Application.Common.Interfaces
{
    public interface IGroqService
    {
        Task<string> AnalyzeInventoryImageAsync(
            byte[] fileBytes,
            string contentType,
            CancellationToken cancellationToken);

        Task<string> AnalyzeInventoryExcelTextAsync(
            string excelJsonStructure,
            CancellationToken cancellationToken);

        Task<string> AnalyzeLowStockRiskAsync(
            string inventoryAnalysisJson,
            CancellationToken cancellationToken);
        Task<string> SuggestComponentAutofillAsync(
            string componentAutofillJson,
            CancellationToken cancellationToken);
    }
}