using Model.Tables.Abstractions;

namespace Model.Tables
{
    public class AccountDto : BaseDto
    {
        public int UserId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal MinValue { get; set; }

        public virtual UserDto User { get; set; }
        public virtual ICollection<TransferDto> DestinationTransfers { get; set; }
        public virtual ICollection<TransferDto> SourceTransfers { get; set; }
    }
}
