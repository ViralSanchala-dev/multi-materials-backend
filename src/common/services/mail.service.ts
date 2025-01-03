import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { SendMailDto } from 'src/admin/authentication/dtos/send-mail.dto';
export class MailService {

    private configService: ConfigService;

    mailTransporter() {
        const transporter = nodemailer.createTransport({
            host: this.configService.get<string>('MAIL_HOST'),
            port: this.configService.get<number>('MAIL_PORT'),
            secure: true,
            auth: {
                user: this.configService.get<string>('MAIL_USER'),
                pass: this.configService.get<string>('MAIL_PASS'),
            },
        });
        return transporter;
    }

    async sendMail(sendMailDto: SendMailDto) {
        const { from, recipents, subject, html, text, placeholderReplacements } = sendMailDto;

        const transporter = this.mailTransporter();

        const options: Mail.Options = {
            from: from ?? {
                name: this.configService.get<string>('APP_NAME'),
                address: this.configService.get<string>('DEFAULT_FROM_EMAIL'),
            },
            to: recipents,
            subject,
            html
        }
        try {
            const result = await transporter.sendMail(options);
            return result;
        } catch (error) {
            console.log(error);
        }
    }
}