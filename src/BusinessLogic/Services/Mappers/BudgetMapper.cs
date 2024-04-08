using BusinessLogic.Abstractions;
using Model.Application;
using Model.Tables;

namespace BusinessLogic.Services.Mappers
{
    public class BudgetMapper : MapperServiceBase<BudgetDto, Budget>
    {
        private readonly IMapperService<BudgetPeriodDto, BudgetPeriod> _budgetPeriodMapper;
        private readonly IMapperService<CategoryDto, Category> _categoryMapper;

        public BudgetMapper(IMapperService<BudgetPeriodDto, BudgetPeriod> budgetPeriodMapper, IMapperService<CategoryDto, Category> categoryMapper)
        {
            _budgetPeriodMapper = budgetPeriodMapper;
            _categoryMapper = categoryMapper;
        }

        public override Budget Map(BudgetDto source)
        {
            List<BudgetCategory> budgetCategories = null;
            List<BudgetPeriod> budgetPeriods = null;

            if (source.BudgetCategories != null)
            {
                budgetCategories = new List<BudgetCategory>();
                foreach (var budgetCategory in source.BudgetCategories)
                {
                    budgetCategories.Add(
                        new BudgetCategory
                        {
                            Id = budgetCategory.Id,
                            BudgetId = budgetCategory.BudgetId,
                            CategoryId = budgetCategory.CategoryId,
                            IsActive = budgetCategory.IsActive,
                            MaxValue = budgetCategory.MaxValue,
                            Category = _categoryMapper.Map(budgetCategory.Category)
                        });
                }
            }

            if (source.BudgetPeriods != null)
            {
                budgetPeriods = _budgetPeriodMapper.Map(source.BudgetPeriods).ToList();
            }

            var budget = new Budget
            {
                Id = source.Id,
                Name = source.Name,
                Description = source.Description,
                ValidFrom = source.ValidFrom,
                ValidTo = source.ValidTo,
                IsActive = source.IsActive,
                BudgetCategories = budgetCategories,
                BudgetPeriods = budgetPeriods
            };

            return budget;
        }
    }
}
