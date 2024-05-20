using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BusinessLogic.Abstractions;
using Model.Identity;
using FluentValidation;
using Model.CustomExceptions;
using Microsoft.Extensions.Localization;
using Util.Resources;

namespace WebApi.Controllers
{
    /// <summary>
    /// Manages login register and user accounts
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class IdentityController : ControllerBase
    {
        private readonly IIdentityService _identityService;
        private readonly IValidator<UserRegisterRequest> _validator;
        private readonly IStringLocalizer<AppResource> _localizer;

        public IdentityController(IIdentityService identityService, IValidator<UserRegisterRequest> validator, IStringLocalizer<AppResource> localizer)
        {
            _identityService = identityService;
            _validator = validator;
            _localizer = localizer;
        }

        /// <summary>
        /// Log in using the application account
        /// </summary>
        /// <param name="userLogin">UserName or email and password</param>
        /// <returns>Authentication token</returns>
        [AllowAnonymous]
        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] UserLoginRequest userLogin)
        {
            try
            {
                var user = await _identityService.Authenticate(userLogin);
                if (user != null)
                {
                    var token = await _identityService.GenerateToken(user);
                    return Ok(token);
                }
                return NotFound(_localizer["err_wrongUserNameOrPassword"].Value);
            }
            catch(InactiveUserException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>
        /// Register a new application account
        /// </summary>
        /// <param name="userRegister">UserName, email and password</param>
        /// <returns>Code 200 Ok</returns>
        [AllowAnonymous]
        [HttpPost("Register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterRequest userRegister)
        {
            var validationResult = await _validator.ValidateAsync(userRegister);

            if (!validationResult.IsValid)
            {
                var errors = validationResult.Errors.Select(e => e.ErrorMessage).ToList();
                return BadRequest(errors);
            }

            var user = await _identityService.RegisterUser(userRegister);
            if (user != null)
            {
                return Ok();
            }

            return StatusCode(500, $"{_localizer["err_errorAt"].Value} {nameof(Register)}");
        }

        /// <summary>
        /// Activate the registered application account
        /// </summary>
        /// <param name="code">Registered configuration code</param>
        /// <returns>Code 200 OK</returns>
        [AllowAnonymous]
        [HttpGet("Activate/{code}")]
        public async Task<IActionResult> Activate([FromRoute] string code)
        {
            var user = await _identityService.Activate(code);
            if (user != null)
            {
                return Ok();
            }

            return BadRequest(_localizer["err_codeDoesnottExistsOrExpired"].Value);
        }

        /// <summary>
        /// Log in using Google account
        /// </summary>
        /// <param name="googleToken">Google Token</param>
        /// <returns>Authentication token</returns>
        [AllowAnonymous]
        [HttpPost("GoogleLogin")]
        public async Task<IActionResult> GoogleLogin([FromBody] GoogleToken googleToken)
        {
            var user = await _identityService.AuthenticateWithGoogle(googleToken.Token);

            if (user != null)
            {
                var token = await _identityService.GenerateToken(user);
                return Ok(token);
            }

            return BadRequest(_localizer["err_userNotFound"].Value);
        }

        /// <summary>
        /// Log in using Facebook account
        /// </summary>
        /// <param name="facebookToken">Facebook Token</param>
        /// <returns>Authentication token</returns>
        [AllowAnonymous]
        [HttpPost("FacebookLogin")]
        public async Task<IActionResult> FacebookLogin([FromBody] FacebookToken facebookToken)
        {
            var user = await _identityService.AuthenticateWithFacebook(facebookToken.Token);

            if (user != null)
            {
                var token = await _identityService.GenerateToken(user);
                return Ok(token);
            }

            return BadRequest(_localizer["err_userNotFound"].Value);
        }
    }
}
