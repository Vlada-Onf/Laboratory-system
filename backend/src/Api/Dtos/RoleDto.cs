using Domain.Roles;

namespace Api.Dtos
{
    public record RoleDto(
        Guid Id,
        string Name,
        DateTime CreatedAt)
    {
        public static RoleDto FromDomainModel(Role role)
            => new(
                role.Id.Value,
                role.Name,
                role.CreatedAt);
    }

    public record CreateRoleDto
    {
        public required string Name { get; init; }
    }

    public record UpdateRoleDto
    {
        public required Guid Id { get; init; }
        public required string Name { get; init; }
    }
}
