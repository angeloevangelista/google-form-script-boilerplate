type SendEmailParams = {
  to: string;
  subject: string;
  htmlBody: string;
  cc: string[];
};

interface IEmailService {
  sendEmail(params: SendEmailParams): Promise<void>;
}

export { IEmailService, SendEmailParams };
