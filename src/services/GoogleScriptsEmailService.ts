import { IEmailService, SendEmailParams } from "../interfaces";

class GoogleScriptsEmailService implements IEmailService {
  public async sendEmail({
    to,
    cc,
    htmlBody,
    subject,
  }: SendEmailParams): Promise<void> {
    MailApp.sendEmail({
      to,
      subject,
      htmlBody,
      cc: cc.join(","),
    });
  }
}

export { GoogleScriptsEmailService };
