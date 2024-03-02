using BusinessLogic.Abstractions;
using Microsoft.Extensions.Configuration;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Model.Identity;
using Model.Tables;
using Util.Enums;
using DataAccessLayer.Mocks;

namespace BusinessLogic.Services
{
    public class IdentityService : IIdentityService
    {
        private readonly IConfiguration _config;
        private readonly IHttpContextAccessor _httpContextAccessor;

        private readonly UserMockRepository _repository;

        public IdentityService(IHttpContextAccessor httpContextAccessor, IConfiguration config, UserMockRepository repository)
        {
            _httpContextAccessor = httpContextAccessor;
            _config = config;
            _repository = repository;
        }
        public Task<UserDto> Authenticate(UserLoginRequest userLogin)
        {
            var user = _repository.GetUser(userLogin);
            return Task.FromResult(user);
        }

        public Task<string> GenerateToken(UserDto user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserName),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.UserRole.ToString())
            };

            var token = new JwtSecurityToken(
                _config["Jwt:Issuer"],
                _config["Jwt:Audience"],
                claims,
                expires: DateTime.Now.AddMinutes(60),
                signingCredentials: credentials);

            var result = new JwtSecurityTokenHandler().WriteToken(token);
            return Task.FromResult(result);
        }

        public Task<UserDto> GetCurrentUser()
        {
            var identity = _httpContextAccessor.HttpContext.User.Identity as ClaimsIdentity;

            if (identity != null)
            {
                var userClaims = identity.Claims;

                var result = new UserDto
                {
                    UserName = userClaims.FirstOrDefault(u => u.Type == ClaimTypes.NameIdentifier)?.Value,
                    Email = userClaims.FirstOrDefault(u => u.Type == ClaimTypes.Email)?.Value,
                    UserRole = Enum.Parse<UserRole>(userClaims.FirstOrDefault(u => u.Type == ClaimTypes.Role)?.Value)
                };
                return Task.FromResult(result);
            }

            return null;
        }
    }
}
