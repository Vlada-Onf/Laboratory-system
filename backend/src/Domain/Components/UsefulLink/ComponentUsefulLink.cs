using Domain.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Components.UsefulLink
{
    public class ComponentUsefulLink
    {
        public ComponentUsefulLinkId Id { get; }
        public ComponentId ComponentId { get; }
        public string Title { get; private set; }
        public string Url { get; private set; }
        public UserId CreatedBy { get; }
        public DateTime CreatedAt { get; }
        public UserId? LastUpdatedBy { get; private set; }
        public DateTime? LastUpdatedAt { get; private set; }
        private ComponentUsefulLink(
            ComponentUsefulLinkId id,
            ComponentId componentId,
            string title,
            string url,
            UserId createdBy,
            DateTime createdAt,
            UserId? lastUpdatedBy,
            DateTime? lastUpdatedAt)
        {
            Id = id;
            ComponentId = componentId;
            Title = title;
            Url = url;
            CreatedBy = createdBy;
            CreatedAt = createdAt;
            LastUpdatedBy = lastUpdatedBy;
            LastUpdatedAt = lastUpdatedAt;
        }

        public static ComponentUsefulLink New(
            ComponentId componentId,
            string title,
            string url,
            UserId createdBy)
        {
            if (string.IsNullOrWhiteSpace(title))
                throw new ArgumentException("Назва не може бути порожнім");

            if (string.IsNullOrWhiteSpace(url))
                throw new ArgumentException("Посилання не може бути порожнім");

            return new ComponentUsefulLink(
                ComponentUsefulLinkId.New(),
                componentId,
                title,
                url,
                createdBy,
                DateTime.UtcNow,
                null,
                null);
        }

        public void Update(string title, string url, UserId updatedBy)
        {
            if (string.IsNullOrWhiteSpace(title))
                throw new ArgumentException("Назва не може бути порожнім");

            if (string.IsNullOrWhiteSpace(url))
                throw new ArgumentException("Посилання не може бути порожнім");

            Title = title;
            Url = url;
            LastUpdatedBy = updatedBy;
            LastUpdatedAt = DateTime.UtcNow;
        }
    }
}
