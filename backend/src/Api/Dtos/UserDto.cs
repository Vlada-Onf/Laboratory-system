namespace Api.Dtos
{
    public record UserDto(
            Guid Id,
            string Email,
            string FirstName,
            string LastName,
            string? PhotoUrl,
            Guid RoleId
        );
    public class ChangeUserStatusDto
    {
        public bool IsActive { get; set; }
    }
}
