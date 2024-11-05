import { CODE_MAILER, MAILER_STATUS } from "../constants/MAILER.ts";

export interface ISendMailer {
	to: string;
	code_template: CODE_MAILER;
	code?: string;
}

export interface ISendMailerTransporter {
	to: string;
	from: string;
	sender: string;
	subject: string;
	html: string;
	text: string;
}

export interface ISendMailerCreateDTO {
	from: string;
	to: string;
	code_template: CODE_MAILER;
	subject: string;
	html: string;
	text: string;
	code?: string;
	status: MAILER_STATUS;
}

export interface IMailerDTO {
	id: string;
	from: string;
	to: string;
	sender: string;
	code_template: CODE_MAILER;
	subject: string;
	html: string;
	text: string;
	code?: string;
	status: MAILER_STATUS;
}
