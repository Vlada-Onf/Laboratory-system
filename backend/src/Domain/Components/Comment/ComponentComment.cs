using Domain.Users;

namespace Domain.Components.Comment
{
    public class ComponentComment
    {
        public ComponentCommentId Id { get; }
        public ComponentId ComponentId { get; }
        public string Content { get; private set; }
        public UserId CreatedBy { get; }
        public DateTime CreatedAt { get; }
        public DateTime? LastUpdatedAt { get; private set; }

        private ComponentComment(
            ComponentCommentId id,
            ComponentId componentId,
            string content,
            UserId createdBy,
            DateTime createdAt,
            DateTime? lastUpdatedAt)
        {
            Id = id;
            ComponentId = componentId;
            Content = content;
            CreatedBy = createdBy;
            CreatedAt = createdAt;
            LastUpdatedAt = lastUpdatedAt;
        }

        public static ComponentComment New(
            ComponentId componentId,
            string content,
            UserId authorId)
        {
            if (string.IsNullOrWhiteSpace(content))
                throw new ArgumentException("Коментар не може бути порожнім");

            return new ComponentComment(
                ComponentCommentId.New(),
                componentId,
                content,
                authorId,
                DateTime.UtcNow,
                null);
        }

        public void Update(string content)
        {
            if (string.IsNullOrWhiteSpace(content))
                throw new ArgumentException("Коментар не може бути порожнім");

            Content = content;
            LastUpdatedAt = DateTime.UtcNow;
        }
    }
}
