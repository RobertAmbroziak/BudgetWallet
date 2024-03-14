using Model.Tables;

namespace Mocks.MockData
{
    public static class BudgetPeriodMockCreator
    {
        public static IEnumerable<BudgetPeriodDto> CreateBudgetPeriods(DateTime budgetValidFrom, DateTime budgetValidTo, IEnumerable<BudgetCategoryDto> budgetCategories)
        {
            var budgetPeriods = new List<BudgetPeriodDto>();
  
            DateTime periodStart = budgetValidFrom;
            DateTime periodEnd = periodStart.AddDays(7);

            while (periodStart < budgetValidTo)
            {
                if (periodEnd > budgetValidTo)
                    periodEnd = budgetValidTo;

                budgetPeriods.Add(new BudgetPeriodDto
                {
                    ValidFrom = periodStart,
                    ValidTo = periodEnd
                });

                periodStart = periodEnd;
                periodEnd = periodStart.AddDays(7);
            }

            foreach (var budgetPeriod in budgetPeriods)
            {
                budgetPeriod.BudgetPeriodCategories = BudgetPeriodCategoryMockCreator.CreateBudgetPeriodCategories(budgetCategories, budgetPeriod, budgetPeriods.Count()).ToList();
            };

            return budgetPeriods;
        }
    }
}
