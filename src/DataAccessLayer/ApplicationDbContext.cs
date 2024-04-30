using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Configuration;
using Model.Tables;
using Model.Tables.Abstractions;
using Util.Helpers;

namespace DataAccessLayer
{
    public class ApplicationDbContext : DbContext, IApplicationDbContext
    {
        private readonly bool _isInMemory;
        private readonly string _InMemoryDatabaseName;
        private readonly IDateTimeProvider _dateTimeProvider;

        public IDbContextTransaction BeginTransaction() => Database.BeginTransaction();

        public ApplicationDbContext(IDateTimeProvider dateTimeProvider)
        {
            _dateTimeProvider = dateTimeProvider;
        }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options, IDateTimeProvider dateTimeProvider) : base(options)
        {
            _dateTimeProvider = dateTimeProvider;
        }

        public ApplicationDbContext(bool isInMemory, string inMemoryDatabaseName, IDateTimeProvider dateTimeProvider)
        {
            _isInMemory = isInMemory;
            _InMemoryDatabaseName = inMemoryDatabaseName;
            _dateTimeProvider = dateTimeProvider;
        }

        public DbSet<UserDto> Users { get; set; }
        public DbSet<AccountDto> Accounts { get; set; }
        public DbSet<TransferDto> Transfers { get; set; }
        public DbSet<CategoryDto> Categories { get; set; }
        public DbSet<SplitDto> Splits { get; set; }
        public DbSet<RegisterConfirmationDto> RegisterConfirmations { get; set; }
        public DbSet<BudgetDto> Budgets { get; set; }
        public DbSet<BudgetPeriodDto> BudgetPeriods { get; set; }
        public DbSet<BudgetCategoryDto> BudgetCategories { get; set; }
        public DbSet<BudgetPeriodCategoryDto> BudgetPeriodCategories { get; set; }
        public DbSet<TransferTemplateDto> TransferTemplates { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            ConfigureBaseDtoProperties(modelBuilder);
            
            modelBuilder.Entity<UserDto>(entity =>
            {
                entity.Property(e => e.UserName).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(200);
                entity.Property(e => e.HashedPassword).HasMaxLength(200);
                entity.Property(e => e.IsActive).IsRequired();
                entity.Property(e => e.UserRole).IsRequired().HasMaxLength(50).HasConversion<string>();
                entity.Property(e => e.Provider).IsRequired().HasMaxLength(50).HasConversion<string>();

                entity.HasMany(u => u.Categories)
                    .WithOne(c => c.User)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasMany(u => u.Budgets)
                    .WithOne(c => c.User)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasMany(u => u.Accounts)
                    .WithOne(c => c.User)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(u => u.RegisterConfirmation)
                    .WithOne(c => c.User)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<AccountDto>(entity =>
            {
                entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Description).HasMaxLength(1000);
                entity.Property(e => e.MinValue).HasColumnType("decimal(18,2)").IsRequired();
                entity.Property(e => e.IsActive).IsRequired();

                entity.HasOne(e => e.User)
                    .WithMany(b => b.Accounts)
                    .HasForeignKey(e => e.UserId);

                entity.HasMany(u => u.DestinationTransfers)
                    .WithOne(c => c.DestinationAccount)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasMany(u => u.SourceTransfers)
                    .WithOne(c => c.SourceAccount)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<TransferDto>(entity =>
            {
                entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Description).HasMaxLength(1000);
                entity.Property(e => e.TransferDate).IsRequired();
                entity.Property(e => e.Value).HasColumnType("decimal(18,2)").IsRequired();
                entity.Property(e => e.TransferType).IsRequired().HasMaxLength(50).HasConversion<string>();

                entity.HasOne(e => e.Budget)
                    .WithMany(b => b.Transfers)
                    .HasForeignKey(e => e.BudgetId)
                    .IsRequired();

                entity.HasOne(e => e.SourceAccount)
                    .WithMany(a => a.SourceTransfers)
                    .HasForeignKey(e => e.SourceAccountId);

                entity.HasOne(e => e.DestinationAccount)
                    .WithMany(a => a.DestinationTransfers)
                    .HasForeignKey(e => e.DestinationAccountId);
            });

            modelBuilder.Entity<CategoryDto>(entity =>
            {
                entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Description).HasMaxLength(1000);
                entity.Property(e => e.IsActive).IsRequired();

                entity.HasOne(e => e.User)
                    .WithMany(b => b.Categories)
                    .HasForeignKey(e => e.UserId);

                entity.HasMany(u => u.Splits)
                    .WithOne(c => c.Category)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasMany(u => u.BudgetCategories)
                    .WithOne(c => c.Category)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasMany(u => u.BudgetPeriodCategories)
                    .WithOne(c => c.Category)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<SplitDto>(entity =>
            {
                entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Description).HasMaxLength(1000);
                entity.Property(e => e.Value).HasColumnType("decimal(18,2)").IsRequired();

                entity.HasOne(e => e.Transfer)
                    .WithMany(b => b.Splits)
                    .HasForeignKey(e => e.TransferId)
                    .IsRequired()
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Category)
                    .WithMany(c => c.Splits)
                    .HasForeignKey(e => e.CategoryId)
                    .IsRequired();
            });

            modelBuilder.Entity<RegisterConfirmationDto>(entity =>
            {
                entity.Property(e => e.Code).IsRequired().HasMaxLength(200);
                entity.Property(e => e.IsUsed).IsRequired();
                entity.Property(e => e.ValidTo).IsRequired();

                entity.HasOne(e => e.User)
                    .WithOne(b => b.RegisterConfirmation)
                    .IsRequired()
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<BudgetDto>(entity =>
            {
                entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Description).HasMaxLength(1000);
                entity.Property(e => e.ValidFrom).IsRequired();
                entity.Property(e => e.ValidTo).IsRequired();

                entity.HasOne(e => e.User)
                    .WithMany(b => b.Budgets)
                    .HasForeignKey(e => e.UserId)
                    .IsRequired();

                entity.HasMany(u => u.BudgetPeriods)
                    .WithOne(c => c.Budget)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasMany(u => u.BudgetCategories)
                    .WithOne(c => c.Budget)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasMany(u => u.Transfers)
                    .WithOne(c => c.Budget)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<BudgetPeriodDto>(entity =>
            {
                entity.Property(e => e.ValidFrom).IsRequired();
                entity.Property(e => e.ValidTo).IsRequired();

                entity.HasOne(e => e.Budget)
                    .WithMany(b => b.BudgetPeriods)
                    .HasForeignKey(e => e.BudgetId) 
                    .IsRequired();

                entity.HasMany(u => u.BudgetPeriodCategories)
                    .WithOne(c => c.BudgetPeriod)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<BudgetCategoryDto>(entity =>
            {
                entity.Property(e => e.MaxValue).HasColumnType("decimal(18,2)").IsRequired();

                entity.HasOne(e => e.Budget)
                    .WithMany(b => b.BudgetCategories)
                    .HasForeignKey(e => e.BudgetId)
                    .IsRequired();

                entity.HasOne(e => e.Category)
                    .WithMany(b => b.BudgetCategories)
                    .HasForeignKey(e => e.CategoryId)
                    .IsRequired();
            });

            modelBuilder.Entity<BudgetPeriodCategoryDto>(entity =>
            {
                entity.Property(e => e.MaxValue).HasColumnType("decimal(18,2)").IsRequired();

                entity.HasOne(e => e.BudgetPeriod)
                    .WithMany(b => b.BudgetPeriodCategories)
                    .HasForeignKey(e => e.BudgetPeriodId)
                    .IsRequired();

                entity.HasOne(e => e.Category)
                    .WithMany(b => b.BudgetPeriodCategories)
                    .HasForeignKey(e => e.CategoryId)
                    .IsRequired();
            });

            modelBuilder.Entity<TransferTemplateDto>(entity =>
            {
                entity.Property(e => e.PrefixName).IsRequired().HasMaxLength(50);
            });

            modelBuilder.Ignore<BaseDto>();
        }

        private void ConfigureBaseDtoProperties(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<BaseDto>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.CreatedBy).IsRequired();
                entity.Property(e => e.LastModifiedBy).IsRequired();
                entity.Property(e => e.CreatedDate).IsRequired();
                entity.Property(e => e.LastModifiedDate).IsRequired();
            });
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            SetDatabaseDates();
            return base.SaveChangesAsync(cancellationToken);
        }

        public override int SaveChanges()
        {
            SetDatabaseDates();
            return base.SaveChanges();
        }

        private void SetDatabaseDates()
        {
            var entries = ChangeTracker
                .Entries()
                .Where(e => e.Entity is BaseDto && (
                        e.State == EntityState.Added
                        || e.State == EntityState.Modified));

            foreach (var entityEntry in entries)
            {
                if (entityEntry.State == EntityState.Modified)
                {
                    ((BaseDto)entityEntry.Entity).LastModifiedDate = _dateTimeProvider.Now;
                }

                if (entityEntry.State == EntityState.Added)
                {
                    ((BaseDto)entityEntry.Entity).CreatedDate = _dateTimeProvider.Now;
                    ((BaseDto)entityEntry.Entity).LastModifiedDate = _dateTimeProvider.Now;
                }
            }
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (_isInMemory)
            {
                optionsBuilder.UseInMemoryDatabase(_InMemoryDatabaseName);
                return;
            }
            if (!optionsBuilder.IsConfigured)
            {
                var configuration = new ConfigurationBuilder()
                    .AddJsonFile("appsettings.json")
                    .Build();

                optionsBuilder.UseSqlServer(configuration.GetConnectionString("DefaultConnection"));
            }
        }
    }
}