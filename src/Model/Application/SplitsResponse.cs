namespace Model.Application
{
    public class SplitsResponse
    {
        public IEnumerable<Split> Splits { get; set; }
        public SplitSummary SplitSummary { get; set; }
        public string ResponseInfo { get; set; }

        /* chart data */
        public IEnumerable<SplitChartItem> SplitChartItems { get; set; } 
    }
}
