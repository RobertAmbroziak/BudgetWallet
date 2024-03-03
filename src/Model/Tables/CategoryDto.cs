using Model.Tables.Abstractions;

namespace Model.Tables
{
    public class CategoryDto : BaseDto
    {
        public int UserId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; }

        public virtual UserDto User { get; set; }
        public virtual ICollection<SplitDto> Splits { get; set; }
        public virtual ICollection<BudgetCategoryDto> BudgetCategories { get; set; }
        public virtual ICollection<BudgetPeriodCategoryDto> BudgetPeriodCategories { get; set; }
    }
}
