using Model.Tables.Abstractions;

namespace Model.Tables
{
    public class BudgetDto : BaseDto
    {
        public int UserId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime ValidFrom { get; set; }
        public DateTime ValidTo { get; set; }

        public virtual UserDto User { get; set; }
        public virtual ICollection<BudgetPeriodDto> BudgetPeriods { get; set; }
        public virtual ICollection<BudgetCategoryDto> BudgetCategories { get; set; }
        public virtual ICollection<TransferDto> Transfers { get; set; }
    }
}
