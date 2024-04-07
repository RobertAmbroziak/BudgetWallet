namespace Model.Application
{
    public class BudgetPeriod
    {
        public int Id { get; set; }
        public int BudgetId { get; set; }
        public DateTime ValidFrom { get; set; }
        public DateTime ValidTo { get; set; }
        public bool IsActive { get; set; }

        public string Name => GetName();

        private string GetName()
        {
            if (ValidFrom.Year == ValidTo.Year)
            {
                return $"({ValidFrom.Year}) {ValidFrom.ToString("MM-dd")} {ValidTo.ToString("MM-dd")}";
            }
            else
            {
                return $"{ValidFrom.ToString("yy-MM-dd")} {ValidTo.ToString("yy-MM-dd")}";
            }
        }
    }
}
