namespace Model.Email
{
    public class EmailRequest
    {
        public string From { get; set; }
        public string To { get; set; }
        public string Cc { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
        public bool IsHtml { get; set; }
        public IEnumerable<EmailAttachment> Attachments { get; set; }
    }
}
