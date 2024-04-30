using BusinessLogic.Abstractions;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using MimeKit;
using Model.Email;
using System.Net.Mime;

namespace BusinessLogic.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task<EmailResponse> SendAsync(EmailRequest request)
        {
            try
            {
                var builder = new BodyBuilder();
                var message = new MimeMessage();
                message.From.Add(MailboxAddress.Parse(request.From));
                var toAddress = new MailboxAddress(request.To, request.To);
                message.To.Add(toAddress);
                if (!string.IsNullOrWhiteSpace(request.Cc))
                    message.Cc.Add(MailboxAddress.Parse(request.Cc));

                message.Subject = request.Subject;

                if (request.Attachments != null)
                {
                    foreach (var attachment in request.Attachments)
                    {
                        builder.Attachments.Add(attachment.Name, attachment.Document, MimeKit.ContentType.Parse(MediaTypeNames.Application.Octet));
                    }
                }

                if (request.IsHtml)
                {
                    builder.HtmlBody = request.Body;
                }
                else
                {
                    builder.TextBody = request.Body;
                }

                message.Body = builder.ToMessageBody();

                bool smtpTls;
                bool.TryParse(_config["EmailConfiguration:SmtpTls"], out smtpTls);

                int smtpHostPort;
                int.TryParse(_config["EmailConfiguration:SmtpHostPort"], out smtpHostPort);

                SecureSocketOptions secureSocketOptions = smtpTls ? SecureSocketOptions.StartTls : SecureSocketOptions.None;

                using (SmtpClient smtpClient = new SmtpClient())
                {
                    await smtpClient.ConnectAsync(_config["EmailConfiguration:SmtpHostAddress"], smtpHostPort, secureSocketOptions);
                    if (!string.IsNullOrEmpty(_config["EmailConfiguration:SmtpHostUser"]) && !string.IsNullOrEmpty(_config["EmailConfiguration:SmtpHostPass"]))
                        await smtpClient.AuthenticateAsync(_config["EmailConfiguration:SmtpHostUser"], _config["EmailConfiguration:SmtpHostPass"]);
                    await smtpClient.SendAsync(message);
                    await smtpClient.DisconnectAsync(true);
                    return new EmailResponse { Success = true };
                }
            }

            catch (Exception e)
            {
                return new EmailResponse
                {
                    Success = false,
                    Error = e.Message
                };
            }
        }
    }
}
