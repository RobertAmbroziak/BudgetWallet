namespace Model.Identity
{
    public class GoogleUserInfo
    {
        public string Sub { get; set; }
        public string Name { get; set; }
        public string GivenName { get; set; }
        public string FamilyName { get; set; }
        public string Picture { get; set; }
        public string Email { get; set; }
        public bool EmailVerified { get; set; }
        public string Locale { get; set; }
    }
}
