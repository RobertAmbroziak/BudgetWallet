using BusinessLogic.Abstractions;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Model.Application;
using WebApi.Validators;

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
        private readonly PostTransferValidator _postTransferValidator;
        private readonly PostTransferInternalValidator _postTransferInternalValidator;

        public TransferController(IApplicationService applicationService, PostTransferValidator postTransferValidator, PostTransferInternalValidator postTransferInternalValidator)
        {
            _applicationService = applicationService;
            _postTransferValidator = postTransferValidator;
            _postTransferInternalValidator = postTransferInternalValidator;
        }

        /// <summary>
        /// Get splits with extra data
        /// </summary>
        /// <param name="splitsRequest">4 int/nullable int parameters from filter</param>
        /// <returns>SplitsResponse</returns>
        [HttpGet("Splits")]
        public async Task<ActionResult<SplitsResponse>> GetSplitsResponse([FromQuery] SplitsRequest splitsRequest)
        {
            var splitsResponse = await _applicationService.GetSplitsResponse(splitsRequest);
            return Ok(splitsResponse);
        }

        /// <summary>
        /// Add new expense transfer with splits
        /// </summary>
        /// <param name="postTransfer">Transfer with split list</param>
        /// <returns>Code 200 Accepted</returns>
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

        /// <summary>
        /// Update exists expense transfer with splits
        /// </summary>
        /// <param name="postTransfer">Transfer with split list</param>
        /// <returns>Code 200 Accepted</returns>
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

        /// <summary>
        /// Update exists deposit/internalTransfer transfer without splits
        /// </summary>
        /// <param name="postTransfer">Transfer without split</param>
        /// <param name="transferId">Transfer Id</param>
        /// <returns>Code 200 Accepted</returns>
        [HttpPut("internal")]
        public async Task<ActionResult> UpdateInternalTransfer(PostTransfer transfer)
        {
            var validationResult = await _postTransferInternalValidator.ValidateAsync(transfer);

            if (!validationResult.IsValid)
            {
                var errors = validationResult.Errors.Select(e => e.ErrorMessage).ToList();
                return BadRequest(errors);
            }
            await _applicationService.UpdateTransfer(transfer);
            return Accepted();
        }

        /// <summary>
        /// Add new deposit/internalTransfer transfer without splits
        /// </summary>
        /// <param name="postTransfer">Transfer without split</param>
        /// <returns>Code 200 Accepted</returns>
        [HttpPost("internal")]
        public async Task<ActionResult> AddInternalTransfer(PostTransfer transfer)
        {
            var validationResult = await _postTransferInternalValidator.ValidateAsync(transfer);

            if (!validationResult.IsValid)
            {
                var errors = validationResult.Errors.Select(e => e.ErrorMessage).ToList();
                return BadRequest(errors);
            }
            await _applicationService.AddTransfer(transfer);
            return Accepted();
        }

        /// <summary>
        /// Get all user deposit/internalTransfer transfers without splits
        /// </summary>
        /// <returns>TODO</returns>
        [HttpGet("internal")]
        public async Task<ActionResult> GetInternalTransfers()
        {
            var internalTransfers = await _applicationService.GetInternalTransfers();
            return Ok(internalTransfers);
        }

        /// <summary>
        /// Get one user deposit/internalTransfer transfers without splits by transferId
        /// </summary>
        /// <param name="transferId">Transfer Id</param>
        /// <returns>TODO</returns>
        [HttpGet("internal/{transferId}")]
        public async Task<ActionResult> GetInternalTransfer([FromRoute] int transferId)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Get all user expense transfers associated with inactive budget or inactive budget category
        /// </summary>
        /// <returns>TODO</returns>
        [HttpGet("outOfBudgets")]
        public async Task<ActionResult> GetOutOfBudgetsTransfers()
        {
            throw new NotImplementedException();
        }
    }
}