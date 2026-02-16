namespace Api.Dtos
{
    public record TagDto(
        Guid Id,
        string Name,
        string Color)
    {
        public static TagDto FromDomainModel(Domain.Tags.Tag tag)
            => new(tag.Id.Value, tag.Name, tag.Color);
    }

    public record CreateTagDto
    {
        public required string Name { get; init; }
        public required string Color { get; init; }
        public required Guid CreatedBy { get; init; }
    }

    public record UpdateTagDto
    {
        public required Guid Id { get; init; }
        public required string Name { get; init; }
        public required string Color { get; init; }
    }
}
