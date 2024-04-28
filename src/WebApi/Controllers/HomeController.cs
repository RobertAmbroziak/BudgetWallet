using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    /// <summary>
    /// Universal Controller for home area
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class HomeController : ControllerBase
    {
        /// <summary>
        /// Get temporary content for home module
        /// </summary>
        /// <returns>content</returns>
        [HttpGet]
        public IActionResult Public()
        {
            return Ok("Dane zwrócone przez API dla strony domowej");
        }
    }
}
