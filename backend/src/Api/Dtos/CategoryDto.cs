using Domain.Categories;

namespace Api.Dtos
{
    public record CategoryDto(
        Guid Id,
        string Name,
        string? Description,
        string? PhotoUrl,
        string? CardColor,
        DateTime CreatedAt,
        DateTime? LastUpdatedAt)
    {
        public static CategoryDto FromDomainModel(Category category)
            => new(
                category.Id.Value,
                category.Name,
                category.Description,
                category.PhotoUrl,
                category.CardColor,
                category.CreatedAt,
                category.LastUpdatedAt);
    }

    public class CreateCategoryDto
    {
        public string Name { get; set; } = "";
        public string? Description { get; set; }
        public string? CardColor { get; set; }
    }

    public class UpdateCategoryDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = "";
        public string? Description { get; set; }
        public string? CardColor { get; set; }
    }
}
