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

    public record CreateCategoryDto(
        string Name,
        string? Description,
        string? PhotoUrl,
        string? CardColor);

    public record UpdateCategoryDto(
        Guid Id,
        string Name,
        string? Description,
        string? PhotoUrl,
        string? CardColor);
}
