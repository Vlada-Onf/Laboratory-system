namespace Api.Dtos
{
    public record DamagedComponentDto(
        Guid Id,
        Guid ComponentId,
        Guid ReasonId,
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
                d.ReasonId.Value,
                d.Quantity,
                d.RecordedAt,
                d.RecordedBy.Value,
                d.LastUpdatedAt,
                d.LastUpdatedBy?.Value);
    }

    public record CreateDamagedComponentDto(
        Guid ComponentId,
        Guid ReasonId,
        int Quantity,
        Guid RecordedBy);

    public record UpdateDamagedComponentDto(
        Guid Id,
        Guid ComponentId,
        Guid ReasonId,
        int Quantity,
        Guid UpdatedBy);
}
