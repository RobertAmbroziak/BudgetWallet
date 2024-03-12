using Model.Tables;

namespace Mocks.MockData
{
    public static class BudgetPeriodCategoryMockCreator
    {
        public static IEnumerable<BudgetPeriodCategoryDto> CreateBudgetPeriodCategories(IEnumerable<BudgetCategoryDto> budgetCategories, BudgetPeriodDto budgetPeriod, int budgetPeriodCount)
        {
            var budgetPeriodCategoriess = new List<BudgetPeriodCategoryDto>();
            
            foreach (var budgetCategory in budgetCategories)
            {
                var maxValuePerPeriod = Math.Round(budgetCategory.MaxValue / budgetPeriodCount, 2);

                var budgetPeriodCategory = new BudgetPeriodCategoryDto
                {
                    BudgetPeriod = budgetPeriod,
                    Category = budgetCategory.Category,
                    MaxValue = maxValuePerPeriod
                };

                budgetPeriodCategoriess.Add(budgetPeriodCategory);
            }
            
            return budgetPeriodCategoriess;
        }
    }
}
