using Domain.History.EntityTypes;

namespace Api.Dtos
{
    public record EntityTypeDto(
        Guid Id,
        string Name,
        string? Description,
        DateTime CreatedAt)
    {
        public static EntityTypeDto FromDomainModel(EntityType entityType)
            => new(
                entityType.Id.Value,
                entityType.Name,
                entityType.Description,
                entityType.CreatedAt);
    }

    public record CreateEntityTypeDto
    {
        public required string Name { get; init; }
        public string? Description { get; init; }
    }

    public record UpdateEntityTypeDto
    {
        public required Guid Id { get; init; }
        public required string Name { get; init; }
        public string? Description { get; init; }
    }
}
