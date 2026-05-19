using System.Text.Json;
using Application.Common.Interfaces;
using ClosedXML.Excel;

namespace Infrastructure.Excel;

public sealed class ExcelService : IExcelService
{
    public Task<string> AnalyzeInventoryExcelAsync(
        byte[] fileBytes,
        string fileName,
        CancellationToken cancellationToken)
    {
        var extension = Path.GetExtension(fileName).ToLowerInvariant();
        if (extension is not ".xlsx" and not ".xlsm")
            throw new InvalidOperationException($"Unsupported Excel format: {extension}");

        var workbookResult = new ExcelWorkbookResult();

        using var stream = new MemoryStream(fileBytes);
        using var workbook = new XLWorkbook(stream);

        var sheetIndex = 0;
        foreach (var worksheet in workbook.Worksheets)
        {
            cancellationToken.ThrowIfCancellationRequested();
            sheetIndex++;

            var sheetResult = AnalyzeWorksheet(worksheet, sheetIndex);
            workbookResult.Sheets.Add(sheetResult);
        }

        return Task.FromResult(JsonSerializer.Serialize(workbookResult));
    }

    private static ExcelSheetResult AnalyzeWorksheet(IXLWorksheet worksheet, int sheetIndex)
    {
        var sheetResult = new ExcelSheetResult
        {
            SheetName = worksheet.Name,
            SheetIndex = sheetIndex
        };

        var usedRange = worksheet.RangeUsed();
        if (usedRange is null)
        {
            sheetResult.Warnings.Add("Sheet is empty.");
            return sheetResult;
        }

        var rows = usedRange.RowsUsed().ToList();
        if (rows.Count == 0)
        {
            sheetResult.Warnings.Add("No used rows found.");
            return sheetResult;
        }

        var headerRow = rows.First();
        var headers = headerRow.Cells()
            .Select((c, i) =>
            {
                var value = c.GetFormattedString().Trim();
                return string.IsNullOrWhiteSpace(value) ? $"Column_{i + 1}" : value;
            })
            .ToList();

        var table = new ExcelTableResult
        {
            Headers = headers,
            MappingStrategy = InferStrategy(headers)
        };

        foreach (var row in rows.Skip(1))
        {
            var values = new Dictionary<string, string>();

            for (var i = 0; i < headers.Count; i++)
            {
                var cellValue = row.Cell(i + 1).GetFormattedString().Trim();
                values[headers[i]] = Normalize(cellValue);
            }

            if (values.Values.All(string.IsNullOrWhiteSpace))
                continue;

            table.Rows.Add(new ExcelRowResult
            {
                RowIndex = row.RowNumber(),
                Values = values
            });
        }

        sheetResult.Tables.Add(table);
        return sheetResult;
    }

    private static string Normalize(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
            return string.Empty;

        var s = value.Replace("\r\n", " ").Replace("\n", " ").Replace("\r", " ").Trim();
        return System.Text.RegularExpressions.Regex.Replace(s, @"\s+", " ");
    }

    private static NameMappingStrategy InferStrategy(List<string> headers)
    {
        var text = string.Join(" | ", headers).ToLowerInvariant();

        var hasName = text.Contains("назв") || text.Contains("name");
        var hasModel = text.Contains("модель") || text.Contains("model");

        if (hasName && hasModel)
            return NameMappingStrategy.MergeIntoName;

        if (hasName || hasModel)
            return NameMappingStrategy.SingleField;

        return NameMappingStrategy.Separate;
    }
}

public sealed class ExcelWorkbookResult
{
    public List<ExcelSheetResult> Sheets { get; set; } = [];
}

public sealed class ExcelSheetResult
{
    public string SheetName { get; set; } = string.Empty;
    public int SheetIndex { get; set; }
    public List<ExcelTableResult> Tables { get; set; } = [];
    public List<string> Warnings { get; set; } = [];
}

public sealed class ExcelTableResult
{
    public List<string> Headers { get; set; } = [];
    public List<ExcelRowResult> Rows { get; set; } = [];
    public NameMappingStrategy MappingStrategy { get; set; } = NameMappingStrategy.Separate;
}

public sealed class ExcelRowResult
{
    public int RowIndex { get; set; }
    public Dictionary<string, string> Values { get; set; } = [];
}

public enum NameMappingStrategy
{
    Separate = 0,
    MergeIntoName = 1,
    SingleField = 2
}