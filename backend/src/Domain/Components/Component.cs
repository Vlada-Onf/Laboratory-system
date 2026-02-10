using Domain.Categories;
using Domain.Components.Comment;
using Domain.Components.UsefulLink;
using Domain.Tags;
using Domain.Users;

namespace Domain.Components;

public class Component
{
    public ComponentId Id { get; }
    public CategoryId CategoryId { get; private set; }
    public string Name { get; private set; }
    public string? Description { get; private set; }
    public int Quantity { get; private set; }
    public decimal Price { get; private set; }
    public decimal TotalCost { get; private set; }
    public string PhotoUrl { get; private set; }
    public string SupplierLink { get; private set; }
    public string? DocumentationLink { get; private set; }
    public DateTime CreatedAt { get; }
    public UserId CreatedBy { get; }
    public DateTime? LastUpdatedAt { get; private set; }
    public UserId? LastUpdatedBy { get; private set; }
    public ICollection<ComponentUsefulLink> UsefulLinks { get; private set; } = new List<ComponentUsefulLink>();
    public ICollection<ComponentComment> Comments { get; private set; } = new List<ComponentComment>();
    public ICollection<Tag> Tags { get; private set; } = new List<Tag>();

    protected Component() { }

    private Component(
        ComponentId id,
        CategoryId categoryId,
        string name,
        string? description,
        int quantity,
        decimal price,
        decimal totalCost,
        string photoUrl,
        string supplierLink,
        string? documentationLink,
        DateTime createdAt,
        UserId createdBy,
        DateTime? lastUpdatedAt = null,
        UserId? lastUpdatedBy = null)
    {
        Id = id;
        CategoryId = categoryId;
        Name = name;
        Description = description;
        Quantity = quantity;
        Price = price;
        TotalCost = totalCost;
        PhotoUrl = photoUrl;
        SupplierLink = supplierLink;
        DocumentationLink = documentationLink;
        CreatedAt = createdAt;
        CreatedBy = createdBy;
        LastUpdatedAt = lastUpdatedAt;
        LastUpdatedBy = lastUpdatedBy;
    }

    public static Component Create(
        CategoryId categoryId,
        string name,
        string? description,
        int quantity,
        decimal price,
        string photoUrl,
        string supplierLink,
        string? documentationLink,
        UserId createdBy)
    {
        var totalCost = quantity * price;

        return new Component(
            ComponentId.New(),
            categoryId,
            name,
            description,
            quantity,
            price,
            totalCost,
            photoUrl,
            supplierLink,
            documentationLink,
            DateTime.UtcNow,
            createdBy);
    }

    public void Update(
        CategoryId categoryId,
        string name,
        string? description,
        int quantity,
        decimal price,
        string photoUrl,
        string supplierLink,
        string? documentationLink,
        UserId lastUpdatedBy)
    {
        CategoryId = categoryId;
        Name = name;
        Description = description;
        Quantity = quantity;
        Price = price;
        TotalCost = quantity * price;
        PhotoUrl = photoUrl;
        SupplierLink = supplierLink;
        DocumentationLink = documentationLink;
        LastUpdatedAt = DateTime.UtcNow;
        LastUpdatedBy = lastUpdatedBy;
    }

    public ComponentUsefulLink AddUsefulLink(string title, string url, UserId userId)
    {
        var link = ComponentUsefulLink.New(Id, title, url, userId);
        UsefulLinks.Add(link);
        return link;
    }
    public void UpdateUsefulLink(ComponentUsefulLinkId linkId, string title, string url, UserId userId)
    {
        var link = UsefulLinks.FirstOrDefault(l => l.Id == linkId);
        if (link is null)
            throw new InvalidOperationException("Корисне посилання не знайдено");

        link.Update(title, url, userId);
    }
    public void RemoveUsefulLink(ComponentUsefulLinkId id)
    {
        var link = UsefulLinks.FirstOrDefault(l => l.Id == id);
        if (link is not null)
            UsefulLinks.Remove(link);
    }

    public ComponentComment AddComment(string content, UserId userId)
    {
        var comment = ComponentComment.New(Id, content, userId);
        Comments.Add(comment);
        return comment;
    }
    public void UpdateComment(ComponentCommentId commentId, string content)
    {
        var comment = Comments.FirstOrDefault(c => c.Id == commentId);
        if (comment is null)
            throw new InvalidOperationException("Коментар не знайдено");

        comment.Update(content);
    }
    public void RemoveComment(ComponentCommentId id)
    {
        var comment = Comments.FirstOrDefault(c => c.Id == id);
        if (comment is not null)
            Comments.Remove(comment);
    }
    public void AddTag(Tag tag)
    {
        if (Tags.All(t => t.Id != tag.Id))
            Tags.Add(tag);
    }

    public void RemoveTag(TagId id)
    {
        var tag = Tags.FirstOrDefault(t => t.Id == id);
        if (tag is not null)
            Tags.Remove(tag);
    }
}