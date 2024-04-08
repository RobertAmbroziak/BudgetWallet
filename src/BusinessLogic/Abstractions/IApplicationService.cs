using Model.Application;

namespace BusinessLogic.Abstractions
{
    public interface IApplicationService
    {
        Task<SplitsResponse> GetSplitsResponse(SplitsRequest splitsRequest);
        Task AddMockData();
        Task<Filter> GetFilter();
        Task<IEnumerable<BudgetPeriod>> GetBudgetPeriodsByBudgetId(int budgetId);
        Task<UserBudgetsInfo> GetUserBudgetsInfo();
        Task<IEnumerable<Category>> GetBudgetCategories(int budgetId);
        Task<IEnumerable<Account>> GetBudgetAccounts(int budgetId);
        Task AddTransfer(PostTransfer postTransfer);
        Task UpdateTransfer(PostTransfer postTransfer);
        Task<IEnumerable<Account>> GetAccounts();
        Task<IEnumerable<Account>> GetDefaultAccounts(IEnumerable<Account> currentAccounts);
        Task UpdateAccounts(IEnumerable<Account> accounts);
        Task<IEnumerable<Category>> GetCategories();
        Task<IEnumerable<Category>> GetDefaultCategories(IEnumerable<Category> currentCategories);
        Task UpdateCategories(IEnumerable<Category> categories);
        Task<Budget> GetBudget(int budgetId);

        Task<bool> IsAccountIdsBelongToUser(int userId, IEnumerable<int> accountIds, bool onlyActive = false);
        Task<bool> IsBudgetIdsBelongToUser(int userId, IEnumerable<int> budgetIds, bool onlyActive = false);
        Task<bool> IsBudgetPeriodIdsBelongToBudget(int budgetId, IEnumerable<int> budgetPeriodIds, bool onlyActive = false);
        Task<bool> IsCategoryIdsBelongToBudget(int budgetId, IEnumerable<int> categoryIds, bool onlyActive = false);
        Task<bool> IsCategoryIdsBelongToUser(int userId, IEnumerable<int> categoryIds, bool onlyActive = false);
    }
}
