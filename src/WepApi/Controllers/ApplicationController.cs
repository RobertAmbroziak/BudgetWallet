using BusinessLogic.Abstractions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Model.Application;

namespace WepApi.Controllers
{
    [Route("api/[controller]")]
    [Authorize(Roles = "User,Admin")]
    [ApiController]
    public class ApplicationController : ControllerBase
    {
        private readonly IIdentityService _identityService;
        private readonly IApplicationService _applicationService;

        public ApplicationController(IIdentityService identityService, IApplicationService applicationService)
        {
            _identityService = identityService;
            _applicationService = applicationService;
        }

        [HttpGet("UserPanel")]
        public async Task<IActionResult> UsersPanel()
        {
            var currentUser = await _identityService.GetCurrentUser();
            return Ok($"Cześc {currentUser.UserName}, jesteś w panelu USER , posiadasz rolę {currentUser.UserRole}");
        }

        [HttpGet("Splits")]
        public async Task<ActionResult<SplitsResponse>> GetSplitsResponse([FromQuery] SplitsRequest splitsRequest)
        {
            var splitsResponse = await _applicationService.GetSplitsResponse(splitsRequest);
            return Ok(splitsResponse);
        }
    }
}
