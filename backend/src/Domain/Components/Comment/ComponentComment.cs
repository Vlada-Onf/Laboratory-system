using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Components.Comment
{
    public class ComponentComment
    {
        public ComponentCommentId Id { get; }
        public ComponentId ComponentId { get; }
        public string Content { get; private set; }
        public Guid CreatedBy { get; }
        public DateTime CreatedAt { get; }
        public DateTime? UpdatedAt { get; private set; }

        private ComponentComment(
            ComponentCommentId id,
            ComponentId componentId,
            string content,
            Guid createdBy,
            DateTime createdAt,
            DateTime? updatedAt)
        {
            Id = id;
            ComponentId = componentId;
            Content = content;
            CreatedBy = createdBy;
            CreatedAt = createdAt;
            UpdatedAt = updatedAt;
        }

        public static ComponentComment New(
            ComponentId componentId,
            string content,
            Guid authorId)
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
            UpdatedAt = DateTime.UtcNow;
        }
    }
}
