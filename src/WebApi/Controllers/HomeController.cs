using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HomeController : ControllerBase
    {
        [HttpGet]
        public IActionResult Public()
        {
            return Ok("Dane zwrócone przez API dla strony domowej");
        }
    }
}
