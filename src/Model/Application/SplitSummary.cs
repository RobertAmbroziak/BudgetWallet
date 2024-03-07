namespace Model.Application
{
    public class SplitSummary
    {
        public decimal SplitsValue { get; set; }
        public decimal BudgetValue { get; set; }

        public decimal Percentage => (BudgetValue> 0) ? SplitsValue / BudgetValue : 0;
    }
}
