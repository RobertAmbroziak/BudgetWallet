﻿using BusinessLogic.Abstractions;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Model.Application;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [Authorize(Roles = "User,Admin")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IIdentityService _identityService;
        private readonly IApplicationService _applicationService;
        private readonly IValidator<PostTransfer> _postTransferValidator;
        private readonly IValidator<Budget> _budgetValidator;

        public AccountController(IIdentityService identityService, IApplicationService applicationService, IValidator<PostTransfer> postTransferValidator, IValidator<Budget> budgetValidator)
        {
            _identityService = identityService;
            _applicationService = applicationService;
            _postTransferValidator = postTransferValidator;
            _budgetValidator = budgetValidator;
        }
    }
}