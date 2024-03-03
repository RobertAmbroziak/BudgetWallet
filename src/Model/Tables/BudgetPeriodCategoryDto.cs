using Model.Tables.Abstractions;

namespace Model.Tables
{
    public class BudgetPeriodCategoryDto : BaseDto
    {
        public int BudgetPeriodId { get; set; }
        public int CategoryId { get; set; }
        public decimal MaxValue { get; set; }

        public virtual BudgetPeriodDto BudgetPeriod { get; set; }
        public virtual CategoryDto Category { get; set; } 
    }
}
