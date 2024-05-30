namespace Model.Application
{
    public class BudgetRangeInfo
    {
        public bool IsMonthlyRange { get; set; }
        public bool IsWeeklyRange { get; set;}
        public int? BudgetDays { get; set;}
        public bool IsPeriodWeeklyRange { get; set;}
        public IEnumerable<int> PeriodDays { get; set;}
    }
}
