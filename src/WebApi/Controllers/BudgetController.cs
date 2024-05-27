using BusinessLogic.Abstractions;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Model.Application;

namespace WebApi.Controllers
{
    /// <summary>
    /// Manages busgets anf alla budget dependencies
    /// </summary>
    [Route("api/[controller]")]
    [Authorize(Roles = "User,Admin")]
    [ApiController]
    public class BudgetController : ControllerBase
    {
        private readonly IApplicationService _applicationService;
        private readonly IValidator<Budget> _budgetValidator;

        public BudgetController(IApplicationService applicationService, IValidator<Budget> budgetValidator)
        {
            _applicationService = applicationService;
            _budgetValidator = budgetValidator;
        }

        /// <summary>
        /// Get active budget periods by budget id
        /// </summary>
        /// <param name="budgetId">Budget Id</param>
        /// <returns>List of budget periods</returns>
        [HttpGet("{budgetId}/budgetPeriods")]
        public async Task<ActionResult<IEnumerable<BudgetPeriod>>> GetBudgetPeriods([FromRoute] int budgetId)
        {
            var result = await _applicationService.GetBudgetPeriodsByBudgetId(budgetId);
            return Ok(result);
        }

        /// <summary>
        /// Get all user budgets (active and inactive) with extra info
        /// </summary>
        /// <returns>UserBudgetsInfo</returns>
        [HttpGet]
        public async Task<ActionResult<UserBudgetsInfo>> GetBudgets()
        {
            var result = await _applicationService.GetUserBudgetsInfo();
            return Ok(result);
        }

        /// <summary>
        /// Update exists or add new budget
        /// </summary>
        /// <param name="budget">Budget with dependencies</param>
        /// <returns>Code 200 Accepted</returns>
        [HttpPut]
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

        /// <summary>
        /// Get budget with dependencies by budget id
        /// </summary>
        /// <param name="budgetId">Budget Id</param>
        /// <returns>Budget with dependencies</returns>
        [HttpGet("{budgetId}")]
        public async Task<ActionResult<Budget>> GetBudgets([FromRoute] int budgetId)
        {
            var result = await _applicationService.GetBudget(budgetId);
            return Ok(result);
        }

        /// <summary>
        /// Get budget suggestion from the default set with unique name/description, default data and data based on exists categories.
        /// </summary>
        /// <returns>Budget with dependencies</returns>
        [HttpPost("default")]
        public async Task<ActionResult<Budget>> GetDefaultBudget()
        {
            var result = await _applicationService.GetDefaultBudget();
            return Ok(result);
        }

        /// <summary>
        /// Clone budget to another period
        /// </summary>
        /// <param name="budgetId">Budget Id</param>
        /// <returns>Budget with dependencies</returns>
        [HttpPost("{budgetId}/clone")]
        public async Task<ActionResult<Budget>> CloneBudgets([FromRoute] int budgetId)
        {
            var result = await _applicationService.CloneBudget(budgetId);
            return Ok(result);
        }
    }
}