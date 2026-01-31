using Domain.Components;
using Domain.Needs.Importance;

namespace Domain.Needs;

public class Need
{
    public NeedId Id { get; }
    public ComponentId ComponentId { get; private set; }
    public int QuantityNeeded { get; private set; }
    public Guid RequestedBy { get; }
    public DateTime RequestedAt { get; }
    public string? Description { get; private set; }
    public DateTime? CompletedAt { get; private set; }
    public string? CompletionReason { get; private set; }
    public NeedImportanceId ImportanceId { get; private set; }

    private Need(
        NeedId id,
        ComponentId componentId,
        int quantityNeeded,
        Guid requestedBy,
        DateTime requestedAt,
        string? description,
        NeedImportanceId importanceId,
        DateTime? completedAt = null,
        string? completionReason = null)
    {
        if (quantityNeeded <= 0)
            throw new ArgumentException("Кількість мусить бути більше 0");

        Id = id;
        ComponentId = componentId;
        QuantityNeeded = quantityNeeded;
        RequestedBy = requestedBy;
        RequestedAt = requestedAt;
        Description = description;
        ImportanceId = importanceId;
        CompletedAt = completedAt;
        CompletionReason = completionReason;
    }

    public static Need Create(
        ComponentId componentId,
        int quantityNeeded,
        Guid requestedBy,
        string? description,
        NeedImportanceId importanceId)
    {
        return new Need(
            NeedId.New(),
            componentId,
            quantityNeeded,
            requestedBy,
            DateTime.UtcNow,
            description,
            importanceId);
    }

    public void UpdateStatus(NeedImportanceId importanceId, string? reason = null)
    {
        ImportanceId = importanceId;
        CompletedAt = DateTime.UtcNow;
        CompletionReason = reason;
    }

    public void UpdateImportance(NeedImportanceId importanceId)
    {
        ImportanceId = importanceId;
    }

    public void UpdateDetails(
        int quantityNeeded,
        string? description,
        NeedImportanceId importanceId)
    {
        if (quantityNeeded <= 0)
            throw new ArgumentException("Кількість мусить бути більше 0");

        QuantityNeeded = quantityNeeded;
        Description = description;
        ImportanceId = importanceId;
    }
}