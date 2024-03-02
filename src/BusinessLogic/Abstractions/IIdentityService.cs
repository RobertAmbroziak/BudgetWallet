using Model.Identity;
using Model.Tables;

namespace BusinessLogic.Abstractions
{
    public interface IIdentityService
    {
        public Task<UserDto> GetCurrentUser();
        public Task<string> GenerateToken(UserDto user);
        public Task<UserDto> Authenticate(UserLoginRequest userLogin);
    }
}
