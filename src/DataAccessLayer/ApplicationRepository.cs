using DataAccessLayer.Generic;
using Microsoft.EntityFrameworkCore;
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

        public async Task<TransferDto> GetTransferWithSplits(int transferId)
        {
            return await _context.Set<TransferDto>()
                .Include(e => e.Splits)
                .Where(x => x.Id == transferId)
                .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<SplitDto>> GetSplits(SplitsRequest splitsRequest)
        {
            var conditions = new Dictionary<string, object>();

            conditions.Add($"{nameof(SplitDto.Transfer)}.{nameof(TransferDto.TransferType)}", TransferType.Expense);
            conditions.Add($"{nameof(SplitDto.Transfer)}.{nameof(TransferDto.BudgetId)}", splitsRequest.BudgetId);

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
                conditions.Add($"{nameof(SplitDto.Transfer)}.{nameof(TransferDto.SourceAccountId)}", splitsRequest.AccountId);
            }

            if (splitsRequest.CategoryId != null)
            {
                conditions.Add(nameof(SplitDto.CategoryId), splitsRequest.CategoryId);
            }

            conditions.Add(nameof(SplitDto.IsActive), true);

            Expression<Func<SplitDto, bool>> filter = BuildDynamicCondition<SplitDto>(conditions);

            return await _context.Set<SplitDto>()
                .Include(e => e.Transfer).ThenInclude(t => t.SourceAccount)
                .Include(e => e.Category)
                .Where(filter)
                .OrderBy(x => x.Transfer.CreatedDate)
                .ToListAsync();
        }

        public async Task AddMockData(IEnumerable<BudgetDto> budgets, IEnumerable<AccountDto> accounts)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    foreach(var account in accounts)
                    {
                        await InsertAsync(account);
                    }

                    foreach (var budget in budgets)
                    {
                        await InsertAsync(budget);
                    }

                    await SaveChangesAsync();

                    transaction.Commit();
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw;
                }
            }
        }

        public async Task<IEnumerable<CategoryDto>> GetCategoriesByBudgetId(int budgetId)
        {
            return await _context.BudgetCategories
            .Where(bc => bc.BudgetId == budgetId && bc.IsActive && bc.Category.IsActive)
            .Select(bc => bc.Category)
            .ToListAsync();
        }

        public async Task<BudgetDto> GetBudget(int budgetId)
        {
            return await _context.Budgets
            .Include(b => b.BudgetPeriods).ThenInclude(bp => bp.BudgetPeriodCategories).ThenInclude(bpc => bpc.Category)
            .Include(b => b.BudgetCategories).ThenInclude(bc => bc.Category)
            .Where(b => b.Id == budgetId)
            .FirstOrDefaultAsync();
        }

        public async Task<IDictionary<AccountDto, decimal>> GetAccountStates(int userId)
        {
            var userAccounts = await _context.Accounts.Where(a => a.UserId == userId).ToListAsync();

            var transfers = await _context.Transfers
                .Where(t => (t.SourceAccount.UserId == userId || t.DestinationAccount.UserId == userId) && t.IsActive)
                .Select(t => new
                {
                    t.SourceAccountId,
                    t.DestinationAccountId,
                    t.Value
                })
                .ToListAsync();

            var accountBalances = transfers
                .SelectMany(t => new[]
                {
                new { AccountId = t.SourceAccountId, IsSource = true, Value = t.Value },
                new { AccountId = t.DestinationAccountId, IsSource = false, Value = t.Value }
                })
                .GroupBy(t => t.AccountId)
                .Select(g => new
                {
                    AccountId = g.Key,
                    Balance = g.Sum(t => t.IsSource ? -t.Value : t.Value)
                })
                .ToList();

            var result = new Dictionary<AccountDto, decimal>();

            foreach (var account in userAccounts)
            {
                var accountId = account.Id;
                var balance = accountBalances
                    .Where(b => b.AccountId == accountId)
                    .Sum(b => b.Balance);

                result[account] = balance;
            }

            return result;
        }
    }
}
