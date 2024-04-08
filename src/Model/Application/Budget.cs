namespace Model.Application
{
    public class Budget
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime ValidFrom { get; set; }
        public DateTime ValidTo { get; set; }
        public bool IsActive { get; set; }

        public IEnumerable<BudgetPeriod> BudgetPeriods { get; set; }
        public IEnumerable<BudgetCategory> BudgetCategories { get; set; }
    }
}
