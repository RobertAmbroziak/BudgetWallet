namespace Model.Identity
{
    public class ChangePasswordRequest
    {
        public string UserNameOrEmail { get; set; }
        public string NewPassword { get; set; }
    }
}
