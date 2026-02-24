using Domain.DamagedComponents;

namespace Api.Dtos
{
    public record DamagedComponentDto(
        Guid Id,
        Guid ComponentId,
        Guid? ReasonId,
        int Quantity,
        DateTime RecordedAt,
        Guid RecordedBy,
        DateTime? LastUpdatedAt,
        Guid? LastUpdatedBy)
    {
        public static DamagedComponentDto FromDomainModel(DamagedComponent d)
            => new(
                d.Id.Value,
                d.ComponentId.Value,
                d.ReasonId?.Value,
                d.Quantity,
                d.RecordedAt,
                d.RecordedBy.Value,
                d.LastUpdatedAt,
                d.LastUpdatedBy?.Value);
    }

    public class CreateDamagedComponentDto
    {
        public Guid ComponentId { get; set; }
        public Guid ReasonId { get; set; }
        public int Quantity { get; set; }
        public Guid RecordedBy { get; set; }
        public Guid PerformedBy { get; set; }
    }

    public class UpdateDamagedComponentDto
    {
        public Guid Id { get; set; }
        public Guid ComponentId { get; set; }
        public Guid ReasonId { get; set; }
        public int Quantity { get; set; }
        public Guid UpdatedBy { get; set; }
        public Guid PerformedBy { get; set; }
    }
}
