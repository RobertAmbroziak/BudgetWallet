namespace Model.Application
{
    public class BudgetPeriodCategory
    {
        public int Id { get; set; }
        public int BudgetPeriodId { get; set; }
        public int CategoryId { get; set; }
        public decimal MaxValue { get; set; }
        public bool IsActive { get; set; }
        public Category Category { get; set; }
    }
}
