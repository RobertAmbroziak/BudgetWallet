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
        private readonly IValidator<PostTransfer> _postTransferValidator;
        private readonly IValidator<Budget> _budgetValidator;

        public ApplicationController(IIdentityService identityService, IApplicationService applicationService, IValidator<PostTransfer> postTransferValidator, IValidator<Budget> budgetValidator)
        {
            _identityService = identityService;
            _applicationService = applicationService;
            _postTransferValidator = postTransferValidator;
            _budgetValidator = budgetValidator;
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

        [HttpPut("budgets")]
        public async Task<ActionResult> UpdateBudget(Budget budget)
        {
            var validationResult = await _budgetValidator.ValidateAsync(budget);

            if (!validationResult.IsValid)
            {
                var errors = validationResult.Errors.Select(e => e.ErrorMessage).Distinct().ToList();
                return BadRequest(errors);
            }

            await _applicationService.UpdateBudget(budget);
            return Accepted();
        }

        [HttpGet("budgets/{budgetId}")]
        public async Task<ActionResult<Budget>> GetBudgets([FromRoute] int budgetId)
        {
            var result = await _applicationService.GetBudget(budgetId);
            return Ok(result);
        }

        [HttpPost("budgets/default")]
        public async Task<ActionResult<Budget>> GetDefaultBudget()
        {
            var result = await _applicationService.GetDefaultBudget();
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
            var validationResult = await _postTransferValidator.ValidateAsync(postTransfer);

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
            var validationResult = await _postTransferValidator.ValidateAsync(postTransfer);

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

        [HttpPost("accounts/default")]
        public async Task<ActionResult<IEnumerable<Account>>> GetDefaultAccounts(IEnumerable<Account> currentAccounts)
        {
            var result = await _applicationService.GetDefaultAccounts(currentAccounts);
            return Ok(result);
        }

        [HttpPut("accounts")]
        public async Task<ActionResult> UpdateAccounts(IEnumerable<Account> accounts)
        {
            await _applicationService.UpdateAccounts(accounts);
            return Accepted();
        }

        [HttpGet("categories")]
        public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
        {
            var result = await _applicationService.GetCategories();
            return Ok(result);
        }

        [HttpPost("categories/default")]
        public async Task<ActionResult<IEnumerable<Category>>> GetDefaultCategories(IEnumerable<Category> currentCategories)
        {
            var result = await _applicationService.GetDefaultCategories(currentCategories);
            return Ok(result);
        }

        [HttpPut("categories")]
        public async Task<ActionResult> UpdateCategories(IEnumerable<Category> categories)
        {
            await _applicationService.UpdateCategories(categories);
            return Accepted();
        }

        [HttpPut("transfers/{transferId}/interal")]
        public async Task<ActionResult> UpdateInternalTransfer([FromRoute] int transferId, PostTransfer transfer)
        {
            throw new NotImplementedException();
        }

        [HttpPost("transfers/interal")]
        public async Task<ActionResult> AddInternalTransfer(PostTransfer transfer)
        {
            throw new NotImplementedException();
        }

        [HttpGet("transfers/interal")]
        public async Task<ActionResult> GetInternalTransfers()
        {
            throw new NotImplementedException();
        }

        [HttpGet("transfers/{transferId}/interal")]
        public async Task<ActionResult> GetInternalTransfer([FromRoute] int transferId)
        {
            throw new NotImplementedException();
        }

        [HttpGet("transfers/outOfBudgets")]
        public async Task<ActionResult> GetOutOfBudgetsTransfers()
        {
            throw new NotImplementedException();
        }

        [HttpGet("accounts/states")]
        public async Task<ActionResult> GetAccountStates()
        {
            throw new NotImplementedException();
        }
    }
}
