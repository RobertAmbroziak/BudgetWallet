namespace Model.Application
{
    public class BudgetCategory
    {
        public int Id { get; set; }
        public int BudgetId { get; set; }
        public int CategoryId { get; set; }
        public decimal MaxValue { get; set; }
        public bool IsActive { get; set; }
        public Category Category { get; set; }
    }
}
