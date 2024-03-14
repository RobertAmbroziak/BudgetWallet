using Model.Tables;

namespace Mocks.MockData
{
    public class BudgetMockCreator
    {
        private readonly DateTime _currentDate;
        private readonly int _month;
        private readonly int _year;

        public BudgetMockCreator(DateTime currentDate)
        {
            _currentDate = currentDate;
            _month = _currentDate.Month;
            _year = _currentDate.Year;
        }
        public IEnumerable<BudgetDto> CreateBudgets(int userId)
        {
            var categories = CategoryMockCreator.CreateCategories(userId);
            var budgets = new List<BudgetDto>();
            for (var i = 0; i < 12; i++)
            {
                var currentYear = IncrementYear(i);
                var currentMonth = IncrementMonth(i);
                var stringifyCurrentMonth = StringifyMonth(currentMonth);

                var name = $"{currentYear}-{stringifyCurrentMonth}";

                var validFrom = new DateTime(currentYear, currentMonth, 1, 0, 0, 0);
                var validTo = new DateTime(currentMonth == 12 ? currentYear + 1 : currentYear, currentMonth == 12 ? 1 : currentMonth + 1, 1, 0, 0, 0);

                var budgetCategories = BudgetCategoryMockCreator.CreateBudgetCategories(categories);
                
                var budget = new BudgetDto
                {
                    UserId = userId,
                    Name = name,
                    Description = name,
                    ValidFrom = new DateTime(currentYear, currentMonth, 1, 0, 0, 0),
                    ValidTo = new DateTime(currentMonth == 12 ? currentYear + 1 : currentYear, currentMonth == 12 ? 1 : currentMonth + 1, 1, 0, 0, 0),
                    BudgetCategories = budgetCategories.ToList(),
                    BudgetPeriods = BudgetPeriodMockCreator.CreateBudgetPeriods(validFrom, validTo, budgetCategories).ToList(),
                };

                budgets.Add(budget);
            }

            return budgets;
        }

        private int IncrementYear(int index) => (_month + index) > 12 ? _year + 1 : _year;
        private int IncrementMonth(int index) => (_month + index) > 12 ? _month + index - 12 : _month + index;
        private string StringifyMonth(int month) => month < 10 ? "0" + month : month.ToString();
    }
}
