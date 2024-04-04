using BusinessLogic.Abstractions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdministrationController : ControllerBase
    {
        private readonly IIdentityService _identityService;

        public AdministrationController(IIdentityService identityService)
        {
            _identityService = identityService;
        }

        [HttpGet("AdminPanel")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AdminPanel()
        {
            var currentUser = await _identityService.GetCurrentUser();
            return Ok($"Cześć {currentUser.UserName}, jesteś w panelu ADMIN, posiadasz rolę  {currentUser.UserRole}");
        }
    }
}
