using BusinessLogic.Abstractions;
using FluentValidation;
using Microsoft.Extensions.Localization;
using Model.Application;
using Util.Resources;

namespace WebApi.Validators
{
    public class PostTransferInternalValidator : AbstractValidator<PostTransfer>
    {
        private readonly IStringLocalizer<AppResource> _localizer;
        private readonly IIdentityService _identityService;
        private readonly IApplicationService _applicationService;
        private readonly int _userId;

        public PostTransferInternalValidator(IStringLocalizer<AppResource> localizer, IIdentityService identityService, IApplicationService applicationService)
        {
            _localizer = localizer;
            _identityService = identityService;
            _applicationService = applicationService;

            _userId = _identityService.GetCurrentUser().Result?.Id ?? -1;

            RuleFor(x => x.Name)
                .NotEmpty().WithMessage(_localizer["rule_transferNameRequired"].Value)
                .MaximumLength(50).WithMessage(_localizer["rule_transferNameMaxLong"].Value);

            RuleFor(x => x.Description)
                .MaximumLength(200).WithMessage(_localizer["rule_transferDescMaxLong"].Value);

            RuleFor(x => x.SourceAccountId)
                .MustAsync(async (accountId, cancellationToken) => await IsAccountIdBelongToUser(accountId.Value))
                .WithMessage(_localizer["rule_accountIdBelongsToUser"].Value);

            RuleFor(x => x.DestinationAccountId)
                .MustAsync(async (accountId, cancellationToken) => await IsAccountIdBelongToUser(accountId.Value))
                .WithMessage(_localizer["rule_accountIdBelongsToUser"].Value);

            RuleFor(x => x.Value)
                .GreaterThan(0).WithMessage(_localizer["rule_transferValuePositive"].Value);

        }

        private async Task<bool> IsAccountIdBelongToUser(int accountId)
        {
            return await _applicationService.IsAccountIdsBelongToUser(_userId, new List<int> { accountId }, true);
        }
    }
}
