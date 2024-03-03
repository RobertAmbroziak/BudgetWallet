using Model.Tables.Abstractions;
using Util.Enums;

namespace Model.Tables
{
    public class TransferDto : BaseDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public int BudgetId { get; set; }
        public int? SourceAccountId { get; set; }
        public int? DestinationAccountId { get; set; }
        public DateTime TransferDate { get; set; }
        public decimal Value { get; set; }
        public TransferType TransferType { get; set; }

        public virtual BudgetDto Budget { get; set; }
        public virtual AccountDto SourceAccount { get; set; }
        public virtual AccountDto DestinationAccount { get; set; }
        public virtual ICollection<SplitDto> Splits { get; set; }
    }
}
