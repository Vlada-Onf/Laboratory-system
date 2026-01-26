using System;
using System.Collections.Generic;
using System.ComponentModel.Design;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain
{
    public class User
    {
        public Guid Id { get;}
        public string ClerckId { get; private set; }
        public string Email { get; private set; }
        public string Password { get; private set; }
        public string FirstName { get; private set; }
        public string LastName { get; private set; }
        public Guid Role {  get; private set; }
        public bool IsActive { get; private set; }
        public DateTime CreatedAt { get; }
        public DateTime UpdatedAt { get; }
        public DateTime LastActivity {  get; }
        public string PhotoUrl { get; private set; } 

        private User (
            Guid id,
            string clerckId,
            string email,
            string password,
            string firstName,
            string lastName,
            Guid role,
            bool isActive, 
            DateTime createdAt,
            DateTime updatedAt,
            DateTime lastActivity,
            string photoUrl)
        {
            Id = id;
            ClerckId = clerckId;
            Email = email;
            Password = password;
            FirstName = firstName;
            LastName = lastName;
            Role = role;
            IsActive = isActive;
            CreatedAt = createdAt;
            UpdatedAt = updatedAt;
            LastActivity = lastActivity;
            PhotoUrl = photoUrl;
        }

    }
}
