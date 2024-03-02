using BusinessLogic.Abstractions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WepApi.Controllers
{
    [Route("api/[controller]")]
    [Authorize(Roles = "User,Admin")]
    [ApiController]
    public class ApplicationController : ControllerBase
    {
        private readonly IIdentityService _identityService;

        public ApplicationController(IIdentityService identityService)
        {
            _identityService = identityService;
        }

        [HttpGet("UserPanel")]
        [Authorize(Roles = "User,Admin")]
        public async Task<IActionResult> UsersPanel()
        {
            var currentUser = await _identityService.GetCurrentUser();
            return Ok($"Cześc {currentUser.UserName}, jesteś w panelu USER , posiadasz rolę {currentUser.UserRole}");
        }
    }
}
