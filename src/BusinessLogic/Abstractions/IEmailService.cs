using Model.Email;

namespace BusinessLogic.Abstractions
{
    public interface IEmailService
    {
        public Task<EmailResponse> SendAsync(EmailRequest email);
    }
}
