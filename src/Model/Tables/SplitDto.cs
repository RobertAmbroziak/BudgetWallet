using Model.Tables.Abstractions;

namespace Model.Tables
{
    public class SplitDto : BaseDto
    {
        public int TransferId { get; set; }
        public int CategoryId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Value { get; set; }

        public virtual TransferDto Transfer { get; set; }
        public virtual CategoryDto Category { get; set; }
    }
}
