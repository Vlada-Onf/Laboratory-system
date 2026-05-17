using System.Text.Json.Serialization;

namespace Api.Dtos
{
    public class InventoryItemImportDto
    {
        [JsonPropertyName("name")]
        public string Name { get; set; } = "";

        [JsonPropertyName("model")]
        public string Model { get; set; } = "";

        [JsonPropertyName("inventoryNumber")]
        public string InventoryNumber { get; set; } = "";

        [JsonPropertyName("serialNumber")]
        public string SerialNumber { get; set; } = "";

        [JsonPropertyName("state")]
        public string State { get; set; } = "";

        [JsonPropertyName("location")]
        public string Location { get; set; } = "";

        [JsonPropertyName("notes")]
        public string Notes { get; set; } = "";
    }

    public class ImportAiComponentsRequest
    {
        public Guid CategoryId { get; set; }
        public Guid CreatedBy { get; set; }
        public List<InventoryItemImportDto> Items { get; set; } = new();
    }
}