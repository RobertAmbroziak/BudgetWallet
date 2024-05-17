using BusinessLogic.Abstractions;
using FluentValidation;
using Microsoft.Extensions.Localization;
using Model.Application;
using Util.Resources;

namespace WebApi.Validators
{
    public class PostTransferValidator : AbstractValidator<PostTransfer>
    {
        private readonly IStringLocalizer<AppResource> _localizer;
        private readonly IIdentityService _identityService;
        private readonly IApplicationService _applicationService;
        private readonly int _userId;

        public PostTransferValidator(IStringLocalizer<AppResource> localizer, IIdentityService identityService, IApplicationService applicationService)
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

            RuleFor(x => x.BudgetId)
                .MustAsync(async (budgetId, cancellationToken) => await IsBudgetIdBelongToUser(budgetId.Value))
                .WithMessage(_localizer["rule_budgetIdBelongsToUser"].Value);

            RuleFor(x => x.SourceAccountId)
                .MustAsync(async (accountId, cancellationToken) => await IsAccountIdBelongToUser(accountId.Value))
                .WithMessage(_localizer["rule_accountIdBelongsToUser"].Value);

            RuleFor(x => x)
                .MustAsync(async (postTransfer, cancellationToken) =>
                    await IsCategoryIdsBelongToBudget(postTransfer.Splits.Select(s => s.CategoryId), postTransfer.BudgetId.Value))
                .WithMessage(_localizer["rule_categoryIdsBelongToBudget"].Value)
                .When(x => x.Splits != null && x.Splits.Any());

            RuleFor(x => x.Value)
                .GreaterThan(0).WithMessage(_localizer["rule_transferValuePositive"].Value);

            RuleForEach(x => x.Splits)
                .ChildRules(split =>
                {
                    split.RuleFor(s => s.Value)
                        .GreaterThan(0).WithMessage(_localizer["rule_splitValuePositive"].Value);
                });

            RuleFor(x => x.Value)
                .Must((postTransfer, value) =>
                    postTransfer.Splits != null && postTransfer.Splits.Sum(s => s.Value) == value)
                .WithMessage(_localizer["rule_transferSumEqualsSplitSum"].Value)
                .When(x => x.Splits != null && x.Splits.Any());
        }

        private async Task<bool> IsBudgetIdBelongToUser(int budgetId)
        {
            return await _applicationService.IsBudgetIdsBelongToUser(_userId, new List<int> { budgetId }, true);
        }

        private async Task<bool> IsAccountIdBelongToUser(int accountId)
        {
            return await _applicationService.IsAccountIdsBelongToUser(_userId, new List<int> { accountId }, true);
        }

        private async Task<bool> IsCategoryIdsBelongToBudget(IEnumerable<int> categoryIds, int budgetId)
        {
            return await _applicationService.IsCategoryIdsBelongToBudget(budgetId, categoryIds, true);
        }
    }
}
