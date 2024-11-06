import nodemailer, { Transporter } from "nodemailer";
import { MAILER_STATUS } from "../constants/MAILER.ts";
import { ISendMailer, ISendMailerCreateDTO, ISendMailerTransporter } from "../interfaces/MailerInterface.ts";
import { MailerModel } from "../models/Mailer.ts";
import { MailProvidersModel } from "../models/MailProvidersDTO.ts";
import { EmailTemplateService } from "../servicers/EmailTemplateRenderService.ts";

interface IEmailProvider {
	id: string;
	host: string;
	port: number;
	secure: boolean;
	user: string;
	pass: string;
}

interface IEmailResponse {
	accepted: string[];
	rejected: string[];
	envelopeTime: number;
	messageTime: number;
	messageSize: number;
	response: string;
	messageId: string;
}

type TrySendMailResult = { success: true; result: IEmailResponse } | { success: false; result: null };

class MailerProvider {
	public static async sendMail({ code_template, to, code }: ISendMailer): Promise<void> {
		if (!this.isValidEmail(to)) {
			console.error(`Invalid email: ${to}`);
			return;
		}

		const templateBody = EmailTemplateService.getTemplate(code_template, code);
		if (!templateBody) {
			console.error(`Template not found: ${code_template}`);
			return;
		}

		const { subject, template, sender } = templateBody;
		const dataSendMail: ISendMailerTransporter = {
			sender,
			to,
			subject,
			from: sender,
			html: template,
			text: template,
		};

		const mailProviders: IEmailProvider[] = await MailProvidersModel.find({ status: MAILER_STATUS.ACTIVE }).lean();
		if (!mailProviders.length) {
			console.error("No active mail providers");
			return;
		}

		const { success, result, attemptCount } = await MailerProvider.trySendMailToProviders(mailProviders, dataSendMail);
		if (!success || !result) {
			console.error("Failed to send email: No active mail providers available");
			return;
		}

		const dataSendMailerCreate: ISendMailerCreateDTO = {
			from: sender,
			to,
			code_template,
			code,
			status: MAILER_STATUS.ACTIVE,
			html: template,
			text: template,
			subject,
			mail_options: {
				accepted: result.accepted,
				rejected: result.rejected,
				envelope_time: result.envelopeTime,
				message_time: result.messageTime,
				message_size: result.messageSize,
				response: result.response,
				message_id: result.messageId,
				attempts: attemptCount,
				provider_id: mailProviders[attemptCount - 1].id,
			},
		};

		const mailer = await MailerModel.create(dataSendMailerCreate);
		console.log(mailer);
		console.log(`Attempts to send: ${attemptCount}`);
	}

	private static isValidEmail(email: string): boolean {
		const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
		return emailRegex.test(email);
	}

	private static createTransporter(provider: IEmailProvider): Transporter {
		return nodemailer.createTransport({
			host: provider.host,
			port: provider.port,
			secure: provider.secure,
			auth: { user: provider.user, pass: provider.pass },
		});
	}

	private static async trySendMailToProviders(
		mailProviders: IEmailProvider[],
		dataSendMail: ISendMailerTransporter,
	): Promise<{ success: boolean; result: IEmailResponse | null; attemptCount: number }> {
		let attemptCount = 0;

		// Tenta cada provedor de email sequencialmente
		for (const provider of mailProviders) {
			attemptCount++;
			const transporter = MailerProvider.createTransporter(provider);

			try {
				const response = (await transporter.sendMail(dataSendMail)) as IEmailResponse;
				if (response.accepted.length) {
					return { success: true, result: response, attemptCount };
				}
			} catch (error) {
				console.error(`Error sending mail with provider ID ${provider.id}:`, error);
			}
		}

		return { success: false, result: null, attemptCount };
	}
}

export { MailerProvider };
