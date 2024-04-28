using BusinessLogic.Abstractions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Model.Application;

namespace WebApi.Controllers
{
    /// <summary>
    /// Universal Controller for application area
    /// </summary>
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

        /// <summary>
        /// Get temporary content for application module
        /// </summary>
        /// <returns>content</returns>
        [HttpGet]
        public async Task<IActionResult> UsersPanel()
        {
            var currentUser = await _identityService.GetCurrentUser();
            return Ok($"Cześć {currentUser.UserName}, jesteś w panelu USER , posiadasz rolę {currentUser.UserRole}");
        }

        /// <summary>
        /// Get data for transfer filter after init
        /// </summary>
        /// <returns>TransferFilter</returns>
        [HttpGet("transferfilter")]
        public async Task<ActionResult<TransferFilter>> GetTransferFilter()
        {
            return await _applicationService.GetTransferFilter();
        }
    }
}
