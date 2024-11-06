import { Document, Schema, model } from "mongoose";
import { CheckAndGenerateUniqueId } from "../common/CheckAndGenerateUniqueId.ts";
import { MAILER_STATUS } from "../constants/MAILER.ts";
import { IMailerDTO } from "../interfaces/MailerInterface.ts";

export interface IMailerMongo extends Partial<Omit<Document, "id">>, IMailerDTO {}

const MailerSchema = new Schema<IMailerMongo>(
	{
		id: { type: String, required: true, trim: true, index: true, unique: true },
		from: { type: String, required: true, trim: true, index: true },
		to: { type: String, required: true, trim: true, index: true },
		code_template: { type: String, required: true, trim: true, index: true },
		subject: { type: String, required: true, trim: true, index: true },
		html: { type: String, required: true, trim: true, index: true },
		text: { type: String, required: true, trim: true, index: true },
		code: { type: String, trim: true, index: true },
		status: { type: String, required: true, trim: true, index: true, default: MAILER_STATUS.ACTIVE },
		mail_options: {
			accepted: { type: [String] },
			rejected: { type: [String] },
			envelope_time: { type: Number },
			message_time: { type: Number },
			message_size: { type: Number },
			response: { type: String },
			message_id: { type: String },
			attempts: { type: Number },
			provider_id: { type: String },
		},
	},
	{ timestamps: true },
);

MailerSchema.pre("validate", async function (next) {
	this.id = await CheckAndGenerateUniqueId(MailerModel);
	next();
});

export const MailerModel = model<IMailerMongo>("emails", MailerSchema);
