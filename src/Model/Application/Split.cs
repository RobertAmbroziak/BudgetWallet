namespace Model.Application
{
    public class Split
    {
        public int SplitId { get; set; }
        public string SplitName { get; set; }
        public string SplitDescription { get; set; }
        public decimal SplitValue { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
        public string CategoryDescription { get; set; }
        public int AccountSourceId { get; set; }
        public string AccountSourceName { get; set; }
        public string AccountSourceDescription { get; set; }
        public int TransferId { get; set; }
        public string TransferName { get; set; }
        public string TransferDescription { get; set; }
        public DateTime TransferDate { get; set; }

        public int OrderId { get; set; }
        public decimal Percentage { get; set; }

        public string TransferDateFormated => TransferDate.ToString("yyyy-MM-dd HH:mm");
        public string SplitValueFormated => SplitValue.ToString("N2");
    }
}
