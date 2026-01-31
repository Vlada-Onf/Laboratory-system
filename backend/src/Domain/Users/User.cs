using Domain.Roles;
using System;
using System.Collections.Generic;
using System.ComponentModel.Design;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Users
{
    public class User
    {
        public UserId Id { get; }
        public string ClerkId { get; private set; } 
        public string Email { get; private set; }
        public string FirstName { get; private set; }
        public string LastName { get; private set; }
        public RoleId RoleId { get; private set; }
        public bool IsActive { get; private set; }
        public string? PhotoUrl { get; private set; }
        public DateTime CreatedAt { get; }
        public DateTime? UpdatedAt { get; private set; }
        public DateTime? LastActivityAt { get; private set; }
        private User(
            UserId id,
            string clerkId,
            string email,
            string firstName,
            string lastName,
            RoleId roleId,
            bool isActive,
            string? photoUrl,
            DateTime createdAt,
            DateTime? updatedAt = null,
            DateTime? lastActivityAt = null)
        {
            if (string.IsNullOrWhiteSpace(email))
                throw new ArgumentException("Email не може бути порожнім");

            if (string.IsNullOrWhiteSpace(firstName))
                throw new ArgumentException("Ім'я не може бути порожнім");

            if (string.IsNullOrWhiteSpace(lastName))
                throw new ArgumentException("Прізвище не може бути порожнім");

            Id = id;
            ClerkId = clerkId;
            Email = email;
            FirstName = firstName;
            LastName = lastName;
            RoleId = roleId;
            IsActive = isActive;
            PhotoUrl = photoUrl;
            CreatedAt = createdAt;
            UpdatedAt = updatedAt;
            LastActivityAt = lastActivityAt;
        }

        public static User Create(
            string clerkId,
            string email,
            string firstName,
            string lastName,
            RoleId roleId,
            string? photoUrl = null)
        {
            return new User(
                UserId.New(),
                clerkId,
                email,
                firstName,
                lastName,
                roleId,
                isActive: true,
                photoUrl,
                DateTime.UtcNow);
        }

        public void UpdateProfile(
            string firstName,
            string lastName,
            string? photoUrl)
        {
            if (string.IsNullOrWhiteSpace(firstName))
                throw new ArgumentException("Ім'я не може бути порожнім");

            if (string.IsNullOrWhiteSpace(lastName))
                throw new ArgumentException("Прізвище не може бути порожнім");

            FirstName = firstName;
            LastName = lastName;
            PhotoUrl = photoUrl;
            UpdatedAt = DateTime.UtcNow;
        }

        public void UpdateRole(RoleId roleId)
        {
            RoleId = roleId;
            UpdatedAt = DateTime.UtcNow;
        }

        public void Activate()
        {
            IsActive = true;
            UpdatedAt = DateTime.UtcNow;
        }

        public void Deactivate()
        {
            IsActive = false;
            UpdatedAt = DateTime.UtcNow;
        }

        public void RecordActivity()
        {
            LastActivityAt = DateTime.UtcNow;
        }

        public string GetFullName() => $"{FirstName} {LastName}";
    }
}
