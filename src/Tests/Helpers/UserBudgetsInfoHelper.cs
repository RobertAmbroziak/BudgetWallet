using BusinessLogic.Services.Mappers;
using Model.Application;

namespace Tests.Helpers
{
    public static class UserBudgetsInfoHelper
    {
        public static UserBudgetsInfo CreateUserBudgetsInfo()
        {
            var budgetDto = BudgetHelper.CreateBudgetDto();

            var categoryMapper = new CategoryMapper();
            var budgetPeriodMapper = new BudgetPeriodMapper(categoryMapper);
            var budgetMapper = new BudgetMapper(budgetPeriodMapper, categoryMapper);

            return new UserBudgetsInfo
            {
                Budgets = new List<Budget>
                {
                    budgetMapper.Map(budgetDto)
                },
                CurrentBudgetId = 1
            };
        }
    }
}
