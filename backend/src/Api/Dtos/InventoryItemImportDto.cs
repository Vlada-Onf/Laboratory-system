using System.Text.Json.Serialization;

namespace Api.Dtos
{
    public enum NameMappingStrategy
    {
        Separate,
        MergeIntoName,
        SingleField
    }

    public class InventoryItemImportDto
    {
        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;

        [JsonPropertyName("model")]
        public string Model { get; set; } = string.Empty;

        [JsonPropertyName("inventoryNumber")]
        public string InventoryNumber { get; set; } = string.Empty;

        [JsonPropertyName("serialNumber")]
        public string SerialNumber { get; set; } = string.Empty;

        [JsonPropertyName("state")]
        public string State { get; set; } = string.Empty;

        [JsonPropertyName("location")]
        public string Location { get; set; } = string.Empty;

        [JsonPropertyName("notes")]
        public string Notes { get; set; } = string.Empty;

        [JsonPropertyName("mappingStrategy")]
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public NameMappingStrategy MappingStrategy { get; set; } = NameMappingStrategy.Separate;
    }

    public class ImportAiComponentsRequest
    {
        public Guid CategoryId { get; set; }
        public Guid CreatedBy { get; set; }
        public List<InventoryItemImportDto> Items { get; set; } = new();
    }
}