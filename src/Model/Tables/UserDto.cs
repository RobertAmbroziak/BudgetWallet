using Util.Enums;

namespace Model.Tables
{
    public class UserDto
    {
        public string UserName { get; set; }
        public string Email { get; set; }
        public string HashedPassword { get; set; }
        public bool IsActive { get; set; }
        public UserRole UserRole { get; set; }
        public Provider Provider { get; set; }
    }
}
