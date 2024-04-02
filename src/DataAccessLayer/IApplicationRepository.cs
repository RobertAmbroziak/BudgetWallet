using DataAccessLayer.Generic;
using Model.Application;
using Model.Tables;

namespace DataAccessLayer
{
    public interface IApplicationRepository : IRepository
    {
        Task<IEnumerable<SplitDto>> GetSplits(SplitsRequest splitsRequest);
        Task AddTransferWithSplits(TransferDto transfer);
        Task<TransferDto> GetTransferWithSplits(int transferId);
        Task AddMockData(IEnumerable<BudgetDto> budgets, IEnumerable<AccountDto> accounts);
    }
}
