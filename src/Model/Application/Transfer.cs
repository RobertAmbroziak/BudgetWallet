namespace Model.Application
{
    public class Transfer
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int? BudgetId { get; set; }
        public int? SourceAccountId { get; set; }
        public int? DestinationAccountId { get; set; }
        public DateTime TransferDate { get; set; }
        public decimal Value { get; set; }
        public string TransferType { get; set; }
        public bool IsActive { get; set; }
    }
}
