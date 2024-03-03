using Model.Tables.Abstractions;

namespace Model.Tables
{
    public class BudgetPeriodDto : BaseDto
    {
        public int BudgetId{ get; set; }
        public DateTime ValidFrom { get; set; }
        public DateTime ValidTo { get; set; }

        public virtual BudgetDto Budget { get; set; }
        public virtual ICollection<BudgetPeriodCategoryDto> BudgetPeriodCategories { get; set; }
    }
}
