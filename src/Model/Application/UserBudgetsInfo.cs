namespace Model.Application
{
    public class UserBudgetsInfo
    {
        public IEnumerable<Budget> Budgets { get; set; }
        public int CurrentBudgetId { get; set; }
        public IEnumerable<Category> CurrentBudgetCategories { get; set; }
        public IEnumerable<Account> CurrentBudgetAccounts { get; set; }
    }
}
