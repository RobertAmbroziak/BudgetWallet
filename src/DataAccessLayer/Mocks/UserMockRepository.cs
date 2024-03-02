using Model.Identity;
using Model.Tables;
using Util.Enums;

namespace DataAccessLayer.Mocks
{
    public class UserMockRepository
    {
        private IEnumerable<UserDto> _users;

        public UserMockRepository() 
        {
            _users = new List<UserDto> 
            {
                new UserDto{ UserName = "user", Email = "user@ambrodev.pl", HashedPassword = "user", IsActive = true, UserRole = UserRole.User,  Provider = Provider.Application },
                new UserDto{ UserName = "admin", Email = "admin@ambrodev.pl", HashedPassword = "admin", IsActive = true, UserRole = UserRole.Admin,  Provider = Provider.Application }
            };
        }

        public UserDto GetUser(UserLoginRequest userLogin)
        {
            return _users.SingleOrDefault(x => (x.Email == userLogin.EmailOrUserName || x.UserName == userLogin.EmailOrUserName)
                                              && x.HashedPassword == userLogin.Password
                                              && x.IsActive);
        }
    }
}