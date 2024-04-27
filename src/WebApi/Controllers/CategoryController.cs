using BusinessLogic.Abstractions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Model.Application;

namespace WebApi.Controllers
{
    /// <summary>
    /// Manages user categories
    /// </summary>
    [Route("api/[controller]")]
    [Authorize(Roles = "User,Admin")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly IApplicationService _applicationService;

        public CategoryController(IApplicationService applicationService)
        {
            _applicationService = applicationService;
        }

        /// <summary>
        /// Get all user categories (active and inactive)
        /// </summary>
        /// <returns>List of categories</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
        {
            var result = await _applicationService.GetCategories();
            return Ok(result);
        }

        /// <summary>
        /// Get List of category suggestions from the default set, excluding those whose names exist in current categories.
        /// </summary>
        /// <param name="currentAccounts">List of current user categories</param>
        /// <returns>List of categories</returns>
        [HttpPost("default")]
        public async Task<ActionResult<IEnumerable<Category>>> GetDefaultCategories(IEnumerable<Category> currentCategories)
        {
            var result = await _applicationService.GetDefaultCategories(currentCategories);
            return Ok(result);
        }

        /// <summary>
        /// Insert new or update existing user categories
        /// </summary>
        /// <param name="categories">List of categories to update or insert</param>
        /// <returns>Code 202 Accepted</returns>
        [HttpPut]
        public async Task<ActionResult> UpdateCategories(IEnumerable<Category> categories)
        {
            await _applicationService.UpdateCategories(categories);
            return Accepted();
        }

        /// <summary>
        /// Get user categories (active and inactive) from active budget categories of the budget
        /// </summary>
        /// <param name="budgetId">Budget id</param>
        /// <returns>List of categories</returns>
        [HttpGet("budgets/{budgetId}")]
        public async Task<ActionResult<IEnumerable<Category>>> GetBudgetCategories([FromRoute] int budgetId)
        {
            var result = await _applicationService.GetBudgetCategories(budgetId);
            return Ok(result);
        }
    }
}