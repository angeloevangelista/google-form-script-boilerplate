import { IEmailService, SendEmailParams } from "../interfaces";

class FakeEmailService implements IEmailService {
  public async sendEmail({ htmlBody }: SendEmailParams): Promise<void> {
    const [{ writeFileSync }, { resolve }] = await Promise.all([
      import("fs"),
      import("path"),
    ]);

    writeFileSync(
      resolve(__dirname, "..", "..", "./debug-email.html"),
      htmlBody
    );
  }
}

export { FakeEmailService };
