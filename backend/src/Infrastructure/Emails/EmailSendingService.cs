using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Emails
{
    /*public class EmailSendingService : IEmailSendingService
    {
        private readonly ILogger<EmailSendingService> _logger;

        public EmailSendingService(ILogger<EmailSendingService> logger)
        {
            _logger = logger;
        }

        public Task SendEmailAsync(string emailTo, string emailBody)
        {
            try
            {
                // Заглушка: логуємо email замість реальної відправки
                _logger.LogInformation(
                    "Email sent to: {EmailTo}\nBody: {EmailBody}",
                    emailTo,
                    emailBody);

                // TODO: Інтегрувати реальний сервіс відправки:
                // - SendGrid: https://sendgrid.com/
                // - AWS SES: https://aws.amazon.com/ses/
                // - SMTP Server

                // Приклад з SendGrid (закоментовано):
                *//*
                var apiKey = _configuration["SendGrid:ApiKey"];
                var client = new SendGridClient(apiKey);
                var from = new EmailAddress("noreply@yourdomain.com", "Your App");
                var to = new EmailAddress(emailTo);
                var msg = MailHelper.CreateSingleEmail(from, to, "Subject", emailBody, emailBody);
                await client.SendEmailAsync(msg);
                *//*

                return Task.CompletedTask;
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "Failed to send email to: {EmailTo}",
                    emailTo);

                throw;
            }
        }
    }*/
}