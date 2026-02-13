using Domain.Components.Comment;

namespace Api.Dtos
{
    public record ComponentCommentDto(
        Guid Id,
        Guid ComponentId,
        string Content,
        Guid CreatedBy,
        DateTime CreatedAt,
        DateTime? LastUpdatedAt)
    {
        public static ComponentCommentDto FromDomainModel(ComponentComment comment)
            => new(
                comment.Id.Value,
                comment.ComponentId.Value,
                comment.Content,
                comment.CreatedBy.Value,
                comment.CreatedAt,
                comment.LastUpdatedAt);
    }

    public record CreateComponentCommentDto
    {
        public required Guid ComponentId { get; init; }
        public required string Content { get; init; }
        public required Guid CreatedBy { get; init; }
    }

    public record UpdateComponentCommentDto
    {
        public required Guid Id { get; init; }
        public required string Content { get; init; }
    }
}
