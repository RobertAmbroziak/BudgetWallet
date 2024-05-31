using Model.Application;

namespace BusinessLogic.Abstractions
{
    public interface IBudgetService
    {
        Task<IEnumerable<BudgetPeriod>> GetBudgetPeriodsByBudgetId(int budgetId);
        Task<UserBudgetsInfo> GetUserBudgetsInfo();
        Task<Budget> GetBudget(int budgetId);
        Task UpdateBudget(Budget budget);
        Task<Budget> GetDefaultBudget();
        Task<Budget> CloneBudget(int budgetId);
    }
}
