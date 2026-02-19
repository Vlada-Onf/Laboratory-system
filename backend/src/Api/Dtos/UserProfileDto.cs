using Domain.Users;

namespace Api.Dtos
{
    public record UserProfileDto(
            Guid Id,
            string Email,
            string ClerkId,
            string FirstName,
            string LastName,
            Guid RoleId,
            string RoleName,
            bool IsActive,
            string? PhotoUrl,
            DateTime CreatedAt,
            DateTime? UpdatedAt,
            DateTime? LastActivityAt)
    {
        public static UserProfileDto FromDomainModel(User user)
            => new(
                user.Id.Value,
                user.Email,
                user.ClerkId,
                user.FirstName,
                user.LastName,
                user.RoleId.Value,
                user.Role.Name,
                user.IsActive,
                user.PhotoUrl,
                user.CreatedAt,
                user.UpdatedAt,
                user.LastActivityAt);
    }

    public class UpdateSelfProfileDto
    {
        public string FirstName { get; set; } = "";
        public string LastName { get; set; } = "";
        public string? PhotoUrl { get; set; }
    }

    public record AdminUserDto(
        Guid Id,
        string Email,
        string ClerkId,
        string FirstName,
        string LastName,
        Guid RoleId,
        string RoleName,
        bool IsActive,
        string? PhotoUrl,
        DateTime CreatedAt,
        DateTime? UpdatedAt,
        DateTime? LastActivityAt)
    {
        public static AdminUserDto FromDomainModel(User user)
            => new(
                user.Id.Value,
                user.Email,
                user.ClerkId,
                user.FirstName,
                user.LastName,
                user.RoleId.Value,
                user.Role.Name,
                user.IsActive,
                user.PhotoUrl,
                user.CreatedAt,
                user.UpdatedAt,
                user.LastActivityAt);
    }

    public class UpdateUserByAdminDto
    {
        public Guid Id { get; set; }

        public string? FirstName { get; set; }
        public string? LastName { get; set; }

        public Guid? RoleId { get; set; }

        public bool? IsActive { get; set; } 
    }
}
