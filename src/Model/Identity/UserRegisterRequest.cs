namespace Model.Identity
{
    public class UserRegisterRequest
    {
        public string Email { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
    }
}