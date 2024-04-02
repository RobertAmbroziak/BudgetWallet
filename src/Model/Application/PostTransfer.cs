namespace Model.Application
{
    public class PostTransfer
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int BudgetId { get; set; }
        public int SourceAccountId { get; set; }
        public decimal Value { get; set; }
        public DateTime TransferDate { get; set; }
        public string TransferType { get; set; }
        public IEnumerable<PostSplit> Splits { get; set; }
    }
}
