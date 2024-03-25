using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BusinessLogic.Abstractions;
using Model.Identity;
using FluentValidation;
using Model.CustomExceptions;
using Microsoft.Extensions.Localization;
using Util.Resources;

namespace WepApi.Controllers
{
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
    }
}
