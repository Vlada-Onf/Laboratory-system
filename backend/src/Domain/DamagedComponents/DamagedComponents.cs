using Domain.Components;
using Domain.DamagedComponents;
using Domain.DamagedComponents.Reason;

public class DamagedComponent
{
    public DamagedComponentId Id { get; }
    public ComponentId ComponentId { get; private set; }
    public DamagedComponentReasonId ReasonId { get; private set; }
    public int Quantity { get; private set; }

    public DateTime RecordedAt { get; }
    public Guid RecordedBy { get; }
    public DateTime? LastUpdatedAt { get; private set; }
    public Guid? LastUpdatedBy { get; private set; }

    private DamagedComponent(
        DamagedComponentId id,
        ComponentId componentId,
        DamagedComponentReasonId reasonId,
        int quantity,
        DateTime recordedAt,
        Guid recordedBy,
        DateTime? lastUpdatedAt = null,
        Guid? lastUpdatedBy = null)
    {
        if (quantity < 0)
            throw new ArgumentException("Кількість не може бути негативним");

        Id = id;
        ComponentId = componentId;
        ReasonId = reasonId;
        Quantity = quantity;
        RecordedAt = recordedAt;
        RecordedBy = recordedBy;
        LastUpdatedAt = lastUpdatedAt;
        LastUpdatedBy = lastUpdatedBy;
    }

    public static DamagedComponent Create(
        ComponentId componentId,
        DamagedComponentReasonId reasonId,
        int quantity,
        Guid recordedBy)
    {
        return new DamagedComponent(
            DamagedComponentId.New(),
            componentId,
            reasonId,
            quantity,
            DateTime.UtcNow,
            recordedBy);
    }

    public void Update(
        ComponentId componentId,
        DamagedComponentReasonId reasonId,
        int quantity,
        Guid lastUpdatedBy)
    {
        if (quantity < 0)
            throw new ArgumentException("Кількість не може бути негативним");

        ComponentId = componentId;
        ReasonId = reasonId;
        Quantity = quantity;
        LastUpdatedAt = DateTime.UtcNow;
        LastUpdatedBy = lastUpdatedBy;
    }
}