namespace Model.Application
{
    public class SplitsRequest
    {
        public int BudgetId { get; set; }
        public int? BudgetPeriodId { get; set; }
        public int? CategoryId { get; set; }
        public int? AccountId { get; set; }
    }
}
