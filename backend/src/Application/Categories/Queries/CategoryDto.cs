using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Categories.Queries
{
    public sealed class CategoryDto
    {
        public Guid Id { get; init; }
        public string Name { get; init; } = null!;
        public string? Description { get; init; }
        public string? PhotoUrl { get; init; }
        public string? CardColor { get; init; }
        public DateTime CreatedAt { get; init; }
    }
}
