using Model.Tables.Abstractions;

namespace Model.Tables
{
    public class BudgetCategoryDto : BaseDto
    {
        public int BudgetId { get; set; }
        public int CategoryId { get; set; }
        public decimal MaxValue { get; set; }

        public virtual BudgetDto Budget { get; set; }
        public virtual CategoryDto Category { get; set; } 
    }
}
