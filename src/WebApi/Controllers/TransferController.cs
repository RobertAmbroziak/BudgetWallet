using BusinessLogic.Abstractions;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Model.Application;

namespace WebApi.Controllers
{
    /// <summary>
    /// Manages transfers and transfer splits
    /// </summary>
    [Route("api/[controller]")]
    [Authorize(Roles = "User,Admin")]
    [ApiController]
    public class TransferController : ControllerBase
    {
        private readonly IApplicationService _applicationService;
        private readonly IValidator<PostTransfer> _postTransferValidator;

        public TransferController(IApplicationService applicationService, IValidator<PostTransfer> postTransferValidator)
        {
            _applicationService = applicationService;
            _postTransferValidator = postTransferValidator;
        }


        [HttpGet("Splits")]
        public async Task<ActionResult<SplitsResponse>> GetSplitsResponse([FromQuery] SplitsRequest splitsRequest)
        {
            var splitsResponse = await _applicationService.GetSplitsResponse(splitsRequest);
            return Ok(splitsResponse);
        }


        [HttpPost]
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


        [HttpPut]
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


        [HttpPut("internal/{transferId}")]
        public async Task<ActionResult> UpdateInternalTransfer([FromRoute] int transferId, PostTransfer transfer)
        {
            throw new NotImplementedException();
        }


        [HttpPost("interal")]
        public async Task<ActionResult> AddInternalTransfer(PostTransfer transfer)
        {
            throw new NotImplementedException();
        }


        [HttpGet("interal")]
        public async Task<ActionResult> GetInternalTransfers()
        {
            throw new NotImplementedException();
        }


        [HttpGet("internal/{transferId}")]
        public async Task<ActionResult> GetInternalTransfer([FromRoute] int transferId)
        {
            throw new NotImplementedException();
        }


        [HttpGet("outOfBudgets")]
        public async Task<ActionResult> GetOutOfBudgetsTransfers()
        {
            throw new NotImplementedException();
        }
    }
}
