using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Model.Tables;

namespace DataAccessLayer
{
    public interface IApplicationDbContext
    {
        DatabaseFacade Database { get; }

        DbSet<UserDto> Users { get; set; }
        DbSet<AccountDto> Accounts { get; set; }
        DbSet<TransferDto> Transfers { get; set; }
        DbSet<CategoryDto> Categories { get; set; }
        DbSet<SplitDto> Splits { get; set; }
        DbSet<RegisterConfirmationDto> RegisterConfirmations { get; set; }
        DbSet<BudgetDto> Budgets { get; set; }
        DbSet<BudgetPeriodDto> BudgetPeriods { get; set; }
        DbSet<BudgetCategoryDto> BudgetCategories { get; set; }
        DbSet<BudgetPeriodCategoryDto> BudgetPeriodCategories { get; set; }
        DbSet<TransferTemplateDto> TransferTemplates { get; set; }

        DbSet<TEntity> Set<TEntity>() where TEntity : class;
        int SaveChanges();
        Task<int> SaveChangesAsync(CancellationToken cancellationToken = new CancellationToken());
        void Dispose();
    }
}
