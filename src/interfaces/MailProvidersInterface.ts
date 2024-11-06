import { MAIL_PROVIDER_STATUS } from "../constants/MAIL_PROVIDER.ts";

export interface IMailProvidersDTO {
	id: string;
	host: string;
	port: number;
	secure: boolean;
	user: string;
	pass: string;
	status: MAIL_PROVIDER_STATUS;
}
