using Domain.Needs.Importance;

namespace Api.Dtos
{
    public record NeedImportanceDto(
        Guid Id,
        string Name,
        int Level,
        DateTime CreatedAt)
    {
        public static NeedImportanceDto FromDomainModel(NeedImportance importance)
            => new(
                importance.Id.Value,
                importance.Name,
                importance.Level,
                importance.CreatedAt);
    }

    public record CreateNeedImportanceDto
    {
        public required string Name { get; init; }
        public required int Level { get; init; }
    }

    public record UpdateNeedImportanceFullDto
    {
        public required Guid Id { get; init; }
        public required string Name { get; init; }
        public required int Level { get; init; }
    }
}
