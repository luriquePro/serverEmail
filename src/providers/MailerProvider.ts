import nodemailer from "nodemailer";

import { MAILER_STATUS } from "../constants/MAILER.ts";
import { ISendMailer, ISendMailerCreateDTO, ISendMailerTransporter } from "../interfaces/MailerInterface.ts";
import { MailerModel } from "../models/Mailer.ts";
import { EmailTemplateService } from "../servicers/EmailTemplateRenderService.ts";

class MailerProvider {
	public async sendMail({ code_template, to, code }: ISendMailer) {
		const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
		if (!emailRegex.test(to)) {
			console.error("Invalid email: " + to);
			return;
		}

		const templateBody = new EmailTemplateService().getTemplate(code_template, code);
		if (!templateBody) {
			console.error("Template not found: " + code_template);
			return;
		}

		const { subject, template, sender } = templateBody;

		const transporter = nodemailer.createTransport({
			host: process.env.MAILER_HOST,
			port: Number(process.env.MAILER_PORT),
			secure: false,
			auth: {
				user: process.env.MAILER_USER,
				pass: process.env.MAILER_PASS,
			},
		});

		const dataSendMail: ISendMailerTransporter = {
			from: sender,
			sender,
			to,
			subject,
			html: template,
			text: template,
		};

		const response = await transporter.sendMail(dataSendMail);
		const status = response.accepted.length ? MAILER_STATUS.ACTIVE : MAILER_STATUS.INACTIVE;

		const dataSendMailerCreate: ISendMailerCreateDTO = {
			from: sender,
			to: to,
			code_template: code_template,
			code,
			status,
			html: template,
			text: template,
			subject,
		};

		const mailer = await MailerModel.create(dataSendMailerCreate);
	}
}

export { MailerProvider };
