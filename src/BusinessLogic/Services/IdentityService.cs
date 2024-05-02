using BusinessLogic.Abstractions;
using Microsoft.Extensions.Configuration;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Http;
using Model.Identity;
using Model.Tables;
using Util.Enums;
using DataAccessLayer;
using System.Security.Cryptography;
using Model.Email;
using Util.Helpers;

namespace BusinessLogic.Services
{
    public class IdentityService : IIdentityService
    {
        private readonly IConfiguration _config;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IApplicationRepository _applicationRepository;
        private readonly IEmailService _emailService;
        private readonly IDateTimeProvider _dateTimeProvider;

        public IdentityService
        (
            IHttpContextAccessor httpContextAccessor,
            IConfiguration config,
            IApplicationRepository applicationRepository,
            IEmailService emailService,
            IDateTimeProvider dateTimeProvider
        )
        {
            _httpContextAccessor = httpContextAccessor;
            _config = config;
            _applicationRepository = applicationRepository;
            _emailService = emailService;
            _dateTimeProvider = dateTimeProvider;
        }
        public async Task<UserDto> Authenticate(UserLoginRequest userLogin)
        {
            var user = (await _applicationRepository.FilterAsync<UserDto>(x =>
                    (x.UserName == userLogin.EmailOrUserName || x.Email == userLogin.EmailOrUserName)
                    && x.HashedPassword == GetHashedPassword(userLogin.Password) && x.Provider == Provider.Application)).SingleOrDefault();

            if (user != null && user.IsActive == false)
            {
                throw new InvalidCastException();
            }

            return user;
        }

        public async Task<UserDto> RegisterUser(UserRegisterRequest userRegister)
        {
            try
            {
                var user = new UserDto
                {
                    UserName = userRegister.UserName,
                    Email = userRegister.Email,
                    HashedPassword = GetHashedPassword(userRegister.Password),
                    IsActive = true, // TODO: eventually change to false
                    UserRole = UserRole.User,
                    Provider = Provider.Application
                };

                var registerConfirmation = new RegisterConfirmationDto
                {
                    UserId = 0,
                    Code = GenerateRegisterConfirmationCode(),
                    IsUsed = false,
                    ValidTo = _dateTimeProvider.Now.AddDays(30),
                    User = user
                };

                await _applicationRepository.InsertAsync(registerConfirmation);
                await _applicationRepository.SaveChangesAsync();

                var emailRequest = new EmailRequest
                {
                    From = "BudgetWallet",
                    To = userRegister.Email,
                    Subject = "Budget Wallet Registration",
                    Body = $" Testowy kod do rejestracji: {registerConfirmation.Code}"  // TODO: buduj endpoint i to chyba do Frontu, bo przecież Api blokują CORS
                };

                //var emailResponse = await _emailService.SendAsync(emailRequest);

                return user;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public async Task<UserDto> AuthenticateWithGoogle(string googleToken)
        {
            using var httpClient = new HttpClient();
            httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", googleToken);

            try
            {
                HttpResponseMessage response = await httpClient.GetAsync("https://www.googleapis.com/oauth2/v2/userinfo");

                if (response.IsSuccessStatusCode)
                {
                    string responseBody = await response.Content.ReadAsStringAsync();

                    var userInfo = JsonConvert.DeserializeObject<GoogleUserInfo>(responseBody);

                    var currentUser = (await _applicationRepository.FilterAsync<UserDto>(x =>
                            x.Email == userInfo.Email && x.Provider == Provider.Google)).SingleOrDefault();

                    if (currentUser != null)
                    {
                        return currentUser;
                    }
                    else
                    {
                        var newUser = new UserDto
                        {
                            UserName = userInfo.Name,
                            Email = userInfo.Email,
                            HashedPassword = null,
                            IsActive = true,
                            UserRole = UserRole.User,
                            Provider = Provider.Google
                        };

                        await _applicationRepository.InsertAsync(newUser);
                        await _applicationRepository.SaveChangesAsync();

                        return newUser;
                    }
                }
                else
                {
                    return null;
                }
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public Task<string> GenerateToken(UserDto user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.Sid, user.Id.ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.UserName),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.UserRole.ToString())
            };

            var token = new JwtSecurityToken(
                _config["Jwt:Issuer"],
                _config["Jwt:Audience"],
                claims,
                expires: _dateTimeProvider.Now.AddMinutes(480),
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
                    Id = Convert.ToInt32(userClaims.FirstOrDefault(u => u.Type == ClaimTypes.Sid)?.Value),
                    UserName = userClaims.FirstOrDefault(u => u.Type == ClaimTypes.NameIdentifier)?.Value,
                    Email = userClaims.FirstOrDefault(u => u.Type == ClaimTypes.Email)?.Value,
                    UserRole = Enum.Parse<UserRole>(userClaims.FirstOrDefault(u => u.Type == ClaimTypes.Role)?.Value)
                };
                return Task.FromResult(result);
            }

            return null;
        }

        public async Task<UserDto> Activate(string code)
        {
            var registerConfirmation = (await _applicationRepository.FilterAsync<RegisterConfirmationDto>(x => x.Code == code && x.ValidTo >= _dateTimeProvider.Now)).SingleOrDefault();
            if (registerConfirmation != null)
            {
                var user = await _applicationRepository.GetByIdAsync<UserDto>(registerConfirmation.UserId);
                user.IsActive = true;
                await _applicationRepository.SaveChangesAsync();
                return user;
            }

            return null;
        }

        public async Task<bool> IsEmailExists(string email)
        {
            return await _applicationRepository.Any<UserDto>(x => x.Email == email);
        }
        public async Task<bool> IsUserNameExists(string userName)
        {
            return await _applicationRepository.Any<UserDto>(x => x.UserName == userName);
        }

        private string GetHashedPassword(string password)
        {
            using (SHA256 sha256Hash = SHA256.Create())
            {
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(password));

                StringBuilder builder = new StringBuilder();
                for (int i = 0; i < bytes.Length; i++)
                {
                    builder.Append(bytes[i].ToString("x2"));
                }
                return builder.ToString();
            }
        }

        private string GenerateRegisterConfirmationCode()
        {
            return Guid.NewGuid().ToString();
        }
    }
}