import { CODE_MAILER } from "../constants/MAILER.ts";

const templater: Record<CODE_MAILER, [string, string, string]> = {
	US00UCE: ["Confirmação de Email", "Email de confirmação de conta. Seu cód é: ${code}", "luiz.prog.henri@gmail.com"],
};

class EmailTemplateService {
	public static getTemplate(code_template: CODE_MAILER, code?: string): { subject: string; template: string; sender: string } | null {
		const templateData = templater[code_template];
		if (!templateData) return null;

		const [subject, template, sender] = templateData;
		if (!code) {
			return { subject, template, sender };
		}

		const filledTemplate = code ? template.replace("${code}", code) : template;

		return { subject, template: filledTemplate, sender };
	}
}

export { EmailTemplateService };
