using Domain.History.Actions;

public class Action
{
    public ActionId Id { get; }
    public string Name { get; private set; }
    public string? Description { get; private set; }
    public DateTime CreatedAt { get; }
    private Action(
        ActionId id,
        string name,
        string? description,
        DateTime createdAt)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Назва не може бути порожньою");

        Id = id;
        Name = name;
        Description = description;
        CreatedAt = createdAt;
    }

    public static Action Create(string name, string? description = null)
        => new(ActionId.New(), name, description, DateTime.UtcNow);

    public void Update(string name, string? description)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Назва не може бути порожньою");

        Name = name;
        Description = description;
    }
}