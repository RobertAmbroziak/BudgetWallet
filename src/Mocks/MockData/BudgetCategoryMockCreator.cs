using Model.Tables;

namespace Mocks.MockData
{
    public static class BudgetCategoryMockCreator
    {
        private const decimal budgetValue = 8000;
        public static IEnumerable<BudgetCategoryDto> CreateBudgetCategories(IEnumerable<CategoryDto> categories)
        {
            var budgetCategories= new List<BudgetCategoryDto>();

            var maxValuePerCategory = Math.Round(budgetValue/categories.Count(), 2);

            foreach (var category in categories)
            {
                var budgetCategory = new BudgetCategoryDto
                {
                    Category = category,
                    MaxValue = maxValuePerCategory
                };

                budgetCategories.Add(budgetCategory);
            }

            return budgetCategories;
        }
    }
}
