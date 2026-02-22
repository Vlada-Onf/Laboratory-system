using Domain.Components.Comment;
using Domain.Users;

namespace Api.Dtos
{
    public record ComponentCommentDto(
            Guid Id,
            Guid ComponentId,
            string Content,
            Guid CreatedBy,
            string AuthorEmail,
            string AuthorFirstName,
            string AuthorLastName,
            string? AuthorPhotoUrl,
            DateTime CreatedAt,
            DateTime? LastUpdatedAt)
    {
        public static ComponentCommentDto FromDomainModel(
            ComponentComment comment,
            User author)
            => new(
                comment.Id.Value,
                comment.ComponentId.Value,
                comment.Content,
                comment.CreatedBy.Value,
                author.Email,
                author.FirstName,
                author.LastName,
                author.PhotoUrl,
                comment.CreatedAt,
                comment.LastUpdatedAt);
    }
    public class CreateComponentCommentDto
    {
        public Guid ComponentId { get; set; }
        public string Content { get; set; } = "";
        public Guid CreatedBy { get; set; }
        public Guid PerformedBy { get; set; }
    }

    public class UpdateComponentCommentDto
    {
        public Guid Id { get; set; }
        public string Content { get; set; } = "";
        public Guid PerformedBy { get; set; }
    }
}
