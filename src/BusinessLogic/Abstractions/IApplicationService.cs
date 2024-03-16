using Model.Application;

namespace BusinessLogic.Abstractions
{
    public interface IApplicationService
    {
        Task<SplitsResponse> GetSplitsResponse(SplitsRequest splitsRequest);
        Task AddMockData();
        Task<Filter> GetFilter();
        Task<IEnumerable<BudgetPeriod>> GetBudgetPeriodsByBudgetId(int budgetId);
    }
}
