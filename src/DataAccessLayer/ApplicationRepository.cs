using DataAccessLayer.Generic;
using Model.Application;
using Model.Tables;
using System.Linq.Expressions;
using Util.Enums;

namespace DataAccessLayer
{
    public class ApplicationRepository : Repository, IApplicationRepository
    {
        public ApplicationRepository(IApplicationDbContext context) : base(context)
        {
            
        }

        public async Task AddTransferWithSplits(TransferDto transfer)
        {
            await InsertAsync(transfer);
            await SaveChangesAsync();
        }

        public async Task<IEnumerable<SplitDto>> GetSplits(SplitsRequest splitsRequest)
        {
            var conditions = new Dictionary<string, object>();

            conditions.Add(nameof(SplitDto.Transfer.TransferType), TransferType.Expense);
            conditions.Add(nameof(SplitDto.Transfer.BudgetId), splitsRequest.BudgetId);

            if (splitsRequest.BudgetPeriodId != null)
            {

                var budgetPeriod = FirstOrDefault<BudgetPeriodDto>(x => x.Id == splitsRequest.BudgetPeriodId)?.Result;

                if (budgetPeriod != null)
                {
                    DateTime validFrom = budgetPeriod.ValidFrom;
                    DateTime validTo = budgetPeriod.ValidTo;

                    conditions.Add($"{nameof(SplitDto.Transfer)}.{nameof(TransferDto.TransferDate)} >= @0", validFrom);
                    conditions.Add($"{nameof(SplitDto.Transfer)}.{nameof(TransferDto.TransferDate)} < @1", validTo);
                }
            }

            if (splitsRequest.AccountId != null)
            {
                conditions.Add(nameof(SplitDto.Transfer.SourceAccountId), splitsRequest.AccountId);
            }

            if (splitsRequest.CategoryId != null)
            {
                conditions.Add(nameof(SplitDto.CategoryId), splitsRequest.CategoryId);
            }

            Expression<Func<SplitDto, bool>> filter = BuildDynamicCondition<SplitDto>(conditions);

            return await FilterAsync(filter);
        }
    }
}
