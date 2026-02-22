namespace Api.Dtos
{
    namespace Api.Dtos
    {
        public record ActionDto(
            Guid Id,
            string Name,
            string? Description,
            DateTime CreatedAt)
        {
            public static ActionDto FromDomainModel(Action action)
             => new(
                action.Id.Value,
                action.Name,
                action.Description,
                action.CreatedAt);
        }

        public record CreateActionDto
        {
            public required string Name { get; init; }
            public string? Description { get; init; }
        }

        public record UpdateActionDto
        {
            public required Guid Id { get; init; }
            public required string Name { get; init; }
            public string? Description { get; init; }
        }
    }
}
