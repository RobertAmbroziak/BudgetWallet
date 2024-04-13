using BusinessLogic.Abstractions;
using FluentValidation;
using Microsoft.Extensions.Localization;
using Model.Application;
using Util.Resources;

namespace WebApi.Validators
{
    public class BudgetValidator : AbstractValidator<Budget>
    {
        private readonly IStringLocalizer<AppResource> _localizer;
        private readonly IApplicationService _applicationService;
        private readonly IEnumerable<Category> _userCategories;
        private readonly IEnumerable<int> _userCategoryIds;


        public BudgetValidator(IStringLocalizer<AppResource> localizer, IApplicationService applicationService)
        {
            _localizer = localizer;
            _applicationService = applicationService;

            _userCategories = _applicationService.GetCategories().Result;
            _userCategoryIds = _userCategories.Select(x => x.Id);

            InitializeBudgetPeriodCategoriesComplexRules();

            RuleFor(x => x.Name)
                .NotEmpty().WithMessage(_localizer["rule_budgetNameRequired"].Value)
                .MaximumLength(50).WithMessage(_localizer["rule_budgetNameMaxLong"].Value);

            RuleFor(x => x.Description)
                .MaximumLength(200).WithMessage(_localizer["rule_budgetDescMaxLong"].Value);

            RuleFor(x => x)
                .Must(x => (x.ValidTo - x.ValidFrom).TotalDays >= 1)
                .WithMessage(_localizer["rule_budgetValidToDateMustBeGreaterThanValidFromDate"].Value);

            RuleFor(x => x.BudgetPeriods)
                .Must(x => x.Any(p => p.IsActive))
                .WithMessage(_localizer["rule_budgetMustHaveAtLeastOneActivePeriod"].Value);

            RuleFor(x => x.BudgetPeriods)
                .Must(budgetPeriods => budgetPeriods.Where(p => p.IsActive).All(p => (p.ValidTo - p.ValidFrom).TotalDays >= 1))
                .WithMessage(_localizer["rule_periodMustBeAtLeastOneDay"].Value);

            RuleFor(x => x.BudgetPeriods)
                .Must(x => x.Any(p => p.IsActive) && x.Where(p => p.IsActive).OrderBy(p => p.ValidFrom).First().ValidFrom == x.First().ValidFrom)
                .When(x => x.BudgetPeriods.Any(p => p.IsActive))
                .WithMessage(_localizer["rule_firstPeriodMustMatchBudgetStart"].Value);

            RuleFor(x => x.BudgetPeriods)
                .Must(x => x.Any(p => p.IsActive) && x.Where(p => p.IsActive).OrderBy(p => p.ValidFrom).Last().ValidTo == x.Last().ValidTo)
                .When(x => x.BudgetPeriods.Any(p => p.IsActive))
                .WithMessage(_localizer["rule_lastPeriodMustMatchBudgetEnd"].Value);

            RuleFor(x => x.BudgetPeriods)
                .Must(budgetPeriods => budgetPeriods.Where(p => p.IsActive)
                .OrderBy(p => p.ValidFrom)
                .Select((p, i) => new { Period = p, Next = budgetPeriods.Where(p => p.IsActive).OrderBy(v => v.ValidFrom).ElementAtOrDefault(i + 1) })
                .All(p => p.Next == null || p.Period.ValidTo == p.Next.ValidFrom))
            .WithMessage(_localizer["rule_periodsMustBeSequential"].Value);

            RuleFor(x => x.BudgetCategories)
                .Must(x => x.Any(p => p.IsActive))
                .WithMessage(_localizer["rule_budgetMustHaveAtLeastOneCategory"].Value);

            RuleForEach(x => x.BudgetCategories)
                .ChildRules(category =>
                {
                    category.RuleFor(c => c.CategoryId)
                            .GreaterThan(0)
                            .When(c => c.IsActive)
                            .WithMessage(_localizer["rule_categoryIdMustBeValid"].Value)
                            .Must(categoryId => _userCategoryIds.Contains(categoryId))
                            .When(c => c.IsActive)
                            .WithMessage(_localizer["rule_categoryMustBelongToUser"].Value);

                    category.RuleFor(c => c.MaxValue)
                            .GreaterThan(0)
                            .When(c => c.IsActive)
                            .WithMessage(_localizer["rule_categoryMaxValueMustBePositive"].Value);
                });

            RuleForEach(x => x.BudgetPeriods)
                .ChildRules(period =>
                {
                    period.RuleForEach(p => p.BudgetPeriodCategories)
                        .Where(c => c.IsActive)
                        .Must(c => c.CategoryId > 0 && _userCategoryIds.Contains(c.CategoryId))
                        .WithMessage(_localizer["rule_categoryIdMustBeValidAndBelongToUser"].Value);
                });
        }

        private void InitializeBudgetPeriodCategoriesComplexRules()
        {

            RuleForEach(x => x.BudgetPeriods)
                .Must(ValidateBudgetPeriodCategoriesByMaxValue)
                .WithMessage(_localizer["rule_categoryValuesMustMatch"].Value);

            RuleForEach(x => x.BudgetPeriods)
                .Must((budget, period) => ValidateBudgetPeriodCategoriesByCategoryId(budget, period))
                .WithMessage(_localizer["rule_periodCategoriesMustMatchBudgetCategories"].Value);
        }

        private bool ValidateBudgetPeriodCategoriesByMaxValue(Budget budget, BudgetPeriod period)
        {
            if (!period.IsActive)
                return true;

            var budgetPeriodCategorySum = budget.BudgetPeriods
                .Where(p => p.IsActive)
                .SelectMany(p => p.BudgetPeriodCategories.Where(c => c.IsActive))
                .GroupBy(c => c.CategoryId)
                .Select(g => new { CategoryId = g.Key, TotalMaxValue = g.Sum(c => c.MaxValue) })
                .ToList();

            foreach (var pcSum in budgetPeriodCategorySum)
            {
                var budgetCategory = budget.BudgetCategories.FirstOrDefault(bc => bc.CategoryId == pcSum.CategoryId && bc.IsActive);
                if (budgetCategory == null || budgetCategory.MaxValue != pcSum.TotalMaxValue)
                {
                    return false;
                }
            }

            return true;
        }

        private bool ValidateBudgetPeriodCategoriesByCategoryId(Budget budget, BudgetPeriod period)
        {
            if (!period.IsActive)
                return true;

            var requiredCategoryIds = budget.BudgetCategories
                .Where(bc => bc.IsActive)
                .Select(bc => bc.CategoryId)
                .OrderBy(id => id)
                .ToList();

            var budgetPeriodCategoryIds = period.BudgetPeriodCategories
                .Where(c => c.IsActive)
                .Select(c => c.CategoryId)
                .OrderBy(id => id)
                .ToList();

            var result = requiredCategoryIds.SequenceEqual(budgetPeriodCategoryIds);
            return result;
        }
    }
}
