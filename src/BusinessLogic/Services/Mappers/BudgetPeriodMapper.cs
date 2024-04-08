using BusinessLogic.Abstractions;
using Model.Application;
using Model.Tables;

namespace BusinessLogic.Services.Mappers
{
    public class BudgetPeriodMapper : MapperServiceBase<BudgetPeriodDto, BudgetPeriod>
    {
        private readonly IMapperService<CategoryDto, Category> _categoryMapper;

        public BudgetPeriodMapper(IMapperService<CategoryDto, Category> categoryMapper)
        {
            _categoryMapper = categoryMapper;
        }

        public override BudgetPeriod Map(BudgetPeriodDto source)
        {
            List<BudgetPeriodCategory> budgetPeriodCategories = null;

            if (source.BudgetPeriodCategories != null)
            {
                budgetPeriodCategories = new List<BudgetPeriodCategory>();
                foreach (var budgetPeriodCategory in source.BudgetPeriodCategories)
                {
                    budgetPeriodCategories.Add(
                        new BudgetPeriodCategory
                        {
                            Id = budgetPeriodCategory.Id,
                            BudgetPeriodId = budgetPeriodCategory.BudgetPeriodId,
                            CategoryId = budgetPeriodCategory.CategoryId,
                            IsActive = budgetPeriodCategory.IsActive,
                            MaxValue = budgetPeriodCategory.MaxValue,
                            Category = _categoryMapper.Map(budgetPeriodCategory.Category)
                        });
                }
            }

            var budgetPeriod  = new BudgetPeriod
            {
                Id = source.Id,
                BudgetId = source.BudgetId,
                ValidFrom = source.ValidFrom,
                ValidTo = source.ValidTo,
                IsActive = source.IsActive,
                BudgetPeriodCategories = budgetPeriodCategories
            };

            return budgetPeriod;
        }
    }
}
