using BusinessLogic.Abstractions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Model.Application;

namespace WebApi.Controllers
{
    /// <summary>
    /// Manages (bank) user accounts
    /// </summary>
    [Route("api/[controller]")]
    [Authorize(Roles = "User,Admin")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IIdentityService _identityService;
        private readonly IApplicationService _applicationService;

        public AccountController(IIdentityService identityService, IApplicationService applicationService)
        {
            _identityService = identityService;
            _applicationService = applicationService;
        }

        /// <summary>
        /// Get all user accounts (active and inactive)
        /// </summary>
        /// <returns>List of accounts</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Account>>> GetAccounts()
        {
            var result = await _applicationService.GetAccounts();
            return Ok(result);
        }

        /// <summary>
        /// Get List of account suggestions from the default set, excluding those whose names exist in current accounts.
        /// </summary>
        /// <param name="currentAccounts">List of current user accounts</param>
        /// <returns>List of accounts</returns>
        [HttpPost("default")]
        public async Task<ActionResult<IEnumerable<Account>>> GetDefaultAccounts(IEnumerable<Account> currentAccounts)
        {
            var result = await _applicationService.GetDefaultAccounts(currentAccounts);
            return Ok(result);
        }

        /// <summary>
        /// Insert new or update existing user accounts
        /// </summary>
        /// <param name="accounts">List of accounts to update or insert</param>
        /// <returns>Code 202 Accepted</returns>
        [HttpPut]
        public async Task<ActionResult> UpdateAccounts(IEnumerable<Account> accounts)
        {
            await _applicationService.UpdateAccounts(accounts);
            return Accepted();
        }

        /// <summary>
        /// Get all user accounts (active and inactive) with the current balance of these accounts
        /// </summary>
        /// <returns>List of accounts with balance</returns>
        [HttpGet("states")]
        public async Task<ActionResult> GetAccountStates()
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Get user accounts (only active) by budget id
        /// </summary>
        /// <param name="budgetId">Budget id</param>
        /// <returns>List of accounts</returns>
        [HttpGet("budgets/{budgetId}")]
        public async Task<ActionResult<IEnumerable<Account>>> GetBudgetAccounts([FromRoute] int budgetId)
        {
            var result = await _applicationService.GetBudgetAccounts(budgetId);
            return Ok(result);
        }
    }
}