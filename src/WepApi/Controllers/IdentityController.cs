using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BusinessLogic.Abstractions;
using Model.Identity;

namespace WepApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IdentityController : ControllerBase
    {
        private readonly IIdentityService _loginService;

        public IdentityController(IIdentityService loginService)
        {
            _loginService = loginService;
        }

        [AllowAnonymous]
        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] UserLoginRequest userLogin)
        {
            var user = await _loginService.Authenticate(userLogin);
            if (user != null)
            {
                var token = await _loginService.GenerateToken(user);
                return Ok(token);
            }
            return NotFound("User not found");
        }
    }
}
