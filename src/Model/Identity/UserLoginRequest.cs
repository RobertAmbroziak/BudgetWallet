namespace Model.Identity
{
    public class UserLoginRequest
    {
        public string EmailOrUserName { get; set; }
        public string Password { get; set; }
    }
}