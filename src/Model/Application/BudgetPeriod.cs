namespace Model.Application
{
    public class BudgetPeriod
    {
        public int Id { get; set; }
        public int BudgetId { get; set; }
        public DateTime ValidFrom { get; set; }
        public DateTime ValidTo { get; set; }

        public string Name => $"{ValidFrom.ToString("yyMMdd")}-{ValidFrom.ToString("yyMMdd")}"; 
    }
}
