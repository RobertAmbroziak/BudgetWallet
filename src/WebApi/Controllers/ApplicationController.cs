using BusinessLogic.Abstractions;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Model.Application;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [Authorize(Roles = "User,Admin")]
    [ApiController]
    public class ApplicationController : ControllerBase
    {
        private readonly IIdentityService _identityService;
        private readonly IApplicationService _applicationService;
        private readonly IValidator<PostTransfer> _validator;

        public ApplicationController(IIdentityService identityService, IApplicationService applicationService, IValidator<PostTransfer> validator)
        {
            _identityService = identityService;
            _applicationService = applicationService;
            _validator = validator;
        }

        [HttpGet("UserPanel")]
        public async Task<IActionResult> UsersPanel()
        {
            var currentUser = await _identityService.GetCurrentUser();
            return Ok($"Cześć {currentUser.UserName}, jesteś w panelu USER , posiadasz rolę {currentUser.UserRole}");
        }

        [HttpGet("Splits")]
        public async Task<ActionResult<SplitsResponse>> GetSplitsResponse([FromQuery] SplitsRequest splitsRequest)
        {
            var splitsResponse = await _applicationService.GetSplitsResponse(splitsRequest);
            return Ok(splitsResponse);
        }

        [HttpGet("MockDataCreate")]
        public async Task<ActionResult> CreateMockData()
        {
            try 
            {
                await _applicationService.AddMockData();
                return Ok();
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("filter")]
        public async Task<ActionResult<Filter>> GetFilter()
        {
            return await _applicationService.GetFilter();
        }

        [HttpGet("filterBudgetPeriods/{budgetId}")]
        public async Task<ActionResult<IEnumerable<BudgetPeriod>>> GetFilterBudgetPeriods([FromRoute] int budgetId)
        {
            var result = await _applicationService.GetBudgetPeriodsByBudgetId(budgetId);
            return Ok(result);
        }

        [HttpGet("budgets")]
        public async Task<ActionResult<UserBudgetsInfo>> GetBudgets()
        {
            var result = await _applicationService.GetUserBudgetsInfo();
            return Ok(result);
        }

        [HttpGet("budgets/{budgetId}/categories")]
        public async Task<ActionResult<IEnumerable<Category>>> GetBudgetCategories([FromRoute] int budgetId)
        {
            var result = await _applicationService.GetBudgetCategories(budgetId);
            return Ok(result);
        }

        [HttpGet("budgets/{budgetId}/accounts")]
        public async Task<ActionResult<IEnumerable<Account>>> GetBudgetAccounts([FromRoute] int budgetId)
        {
            var result = await _applicationService.GetBudgetAccounts(budgetId);
            return Ok(result);
        }

        [HttpPost("transfers")]
        public async Task<ActionResult> AddTransfer([FromBody] PostTransfer postTransfer)
        {
            var validationResult = await _validator.ValidateAsync(postTransfer);

            if (!validationResult.IsValid)
            {
                var errors = validationResult.Errors.Select(e => e.ErrorMessage).ToList();
                return BadRequest(errors);
            }
            await _applicationService.AddTransfer(postTransfer);
            return Accepted();
        }
        [HttpPut("transfers")]
        public async Task<ActionResult> UpdateTransfer([FromBody] PostTransfer postTransfer)
        {
            var validationResult = await _validator.ValidateAsync(postTransfer);

            if (!validationResult.IsValid)
            {
                var errors = validationResult.Errors.Select(e => e.ErrorMessage).ToList();
                return BadRequest(errors);
            }
            await _applicationService.UpdateTransfer(postTransfer);
            return Accepted();
        }

        [HttpGet("accounts")]
        public async Task<ActionResult<IEnumerable<Account>>> GetAccounts()
        {
            var result = await _applicationService.GetAccounts();
            return Ok(result);
        }
    }
}
