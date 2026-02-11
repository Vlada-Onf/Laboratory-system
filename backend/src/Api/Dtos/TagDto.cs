using Domain.Tags;

namespace Api.Dtos
{
    public record TagDto(Guid Id, string Name, string Color)
    {
        public static TagDto FromDomainModel(Tag tag)
            => new(tag.Id.Value, tag.Name, tag.Color);
    }

    public record CreateTagDto(string Name, string Color, Guid CreatedBy);

    public record UpdateTagDto(Guid Id, string Name, string Color);
}
