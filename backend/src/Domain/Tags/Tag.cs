using Domain.Users;

namespace Domain.Tags;

public class Tag
{
    protected Tag() { }
    public TagId Id { get; }
    public string Name { get; private set; }
    public string Color { get; private set; }

    public DateTime CreatedAt { get; }
    public UserId CreatedBy { get; }

    private Tag(
        TagId id,
        string name,
        string color,
        DateTime createdAt,
        UserId createdBy)
    {
        Name = string.IsNullOrWhiteSpace(name)
            ? throw new ArgumentException("Назва не може бути порожньою")
            : name;

        Color = string.IsNullOrWhiteSpace(color)
            ? throw new ArgumentException("Колір не може бути порожнім")
            : color;

        Id = id;
        CreatedAt = createdAt;
        CreatedBy = createdBy;
    }

    public static Tag Create(string name, string color, UserId createdBy)
        => new(TagId.New(), name, color, DateTime.UtcNow, createdBy);

    public void Rename(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Назва не може бути порожньою");

        Name = name;
    }

    public void ChangeColor(string color)
    {
        if (string.IsNullOrWhiteSpace(color))
            throw new ArgumentException("Колір не може бути порожнім");

        Color = color;
    }
}
