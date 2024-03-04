using Model.Identity;
using Model.Tables;

namespace BusinessLogic.Abstractions
{
    public interface IIdentityService
    {
        public Task<UserDto> GetCurrentUser();
        public Task<string> GenerateToken(UserDto user);
        public Task<UserDto> Authenticate(UserLoginRequest userLogin);
        public Task<UserDto> RegisterUser(UserRegisterRequest registeruser);
        public Task<UserDto> AuthenticateWithGoogle(string googleToken);
        public Task<UserDto> Activate(string code);
        public Task<bool> IsEmailExists(string email);
        public Task<bool> IsUserNameExists(string userName);
    }
}
