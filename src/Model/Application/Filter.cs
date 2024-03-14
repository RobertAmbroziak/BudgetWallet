namespace Model.Application
{
    public class Filter
    {
        public IEnumerable<Budget> Budgets { get; set; }
        public IEnumerable<BudgetPeriod> BudgetPeriods { get; set; }
        public IEnumerable<Account> Accounts { get; set; }
        public IEnumerable<Category> Categories { get; set; }

        public int CurrentBudgetId { get; set; }
    }
}
